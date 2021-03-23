import styled from '@emotion/styled';
import * as DropdownMenu from 'components/DropdownMenu';
import useSWR, { mutate } from 'swr';
import { fetcher } from 'utils/fetch';
import { ButtonWireframe } from 'components/Button';
import { Notification2, Close } from '@styled-icons/remix-line';
import Link from 'next/link';
import { Fragment } from 'react/cjs/react.production.min';

const NotificationButton = styled(ButtonWireframe)`
  &.has-notifications {
    background-color: rgb(var(--pink-500));
  }

  &:not(.has-notifications) {
  }
`;

const NotificationHeader = styled(DropdownMenu.SimpleItem)`
  display: flex;
  align-items: center;
  padding: 1em 24px;
  outline: none;
  justify-content: space-between;
`;

const NotificationContent = styled(DropdownMenu.Content)`
  width: 500px;
  max-height: 80vh;
  overflow: auto;
`;

const NotificationWrapper = styled.div`
  position: relative;
`;

const NotificationItem = styled(DropdownMenu.Item)`
  display: block;
  padding: 12px 24px;
  outline: none;
  text-decoration: none;
  color: inherit !important;

  &:hover {
    cursor: pointer;
    background-color: var(--accent2);
    color: white;
  }

  .label {
    font-style: italic;
    padding-bottom: 4px;
    font-size: 14px;
  }

  .title {
    font-weight: bold;
    font-size: 18px;
  }
`;

const EmptyNotificationItem = styled(DropdownMenu.SimpleItem)`
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  font-size: 14px;
  font-weight: 300;
`;

const HoverIcon = styled(Close)`
  position: absolute;
  top: calc(50% - 12px);
  right: 24px;
  &:hover {
    cursor: pointer;
  }
`;

export default function Notifications() {
  const { data } = useSWR(['/api/get-notifications'], url =>
    fetcher('GET', url)
  );
  if (!data) {
    return (
      <NotificationButton>
        <Notification2 />
      </NotificationButton>
    );
  }

  let newPosts = [];
  let newComments = [];
  data.forEach(notif => {
    if (notif.isNewPost) {
      newPosts.push(notif);
    } else {
      newComments.push(notif);
    }
  });

  const clearAllNotifications = async () => {
    mutate(['/api/get-notifications'], [], false);
    await fetcher('POST', '/api/clear-notifications');
    mutate(['/api/get-notifications']);
  };

  const totalNotifications = newPosts.length + newComments.length;

  const clearNotification = async notification => {
    // Optimistically clear the notification from cache, clear the notification, and resync cache with server after
    mutate(
      ['/api/get-notifications'],
      async notifications => {
        return notifications.filter(
          notif => notif.postId !== notification.postId
        );
      },
      false
    );
    await fetcher('POST', '/api/clear-notification', {
      postId: notification.postId,
    });
    mutate(['/api/get-notifications']);
  };

  return (
    <DropdownMenu.Root>
      <NotificationButton
        as={DropdownMenu.Trigger}
        className={totalNotifications > 0 ? 'has-notifications' : ''}
      >
        <Notification2 />
      </NotificationButton>
      <NotificationContent sideOffset={42}>
        {totalNotifications === 0 ? (
          <DropdownMenu.Group>
            <EmptyNotificationItem>No new notifications</EmptyNotificationItem>
          </DropdownMenu.Group>
        ) : (
          <Fragment>
            <DropdownMenu.Group>
              <NotificationHeader>
                <h3>Notifications ({totalNotifications})</h3>
                <ButtonWireframe
                  disabled={!totalNotifications}
                  onClick={clearAllNotifications}
                >
                  Clear all notifications
                </ButtonWireframe>
              </NotificationHeader>
            </DropdownMenu.Group>
            <DropdownMenu.Group>
              {newPosts.map(notification => {
                return (
                  <NotificationWrapper key={notification.postId}>
                    <Link href={`/post/${notification.postId}`} passHref>
                      <NotificationItem as="a">
                        <div className="label">New Post</div>
                        <div className="title">{notification.postTitle}</div>
                      </NotificationItem>
                    </Link>
                    <HoverIcon
                      onClick={() => clearNotification(notification)}
                    ></HoverIcon>
                  </NotificationWrapper>
                );
              })}
            </DropdownMenu.Group>
            <DropdownMenu.Group>
              {newComments.map(notification => {
                return (
                  <NotificationWrapper key={notification.postId}>
                    <Link href={`/post/${notification.postId}`} passHref>
                      <NotificationItem as="a">
                        <div className="label">
                          {notification.numNewReplies} New Comment
                          {notification.numNewReplies > 1 ? 's' : ''}
                        </div>
                        <div className="title">{notification.postTitle}</div>
                      </NotificationItem>
                    </Link>
                    <HoverIcon
                      onClick={() => clearNotification(notification)}
                    ></HoverIcon>
                  </NotificationWrapper>
                );
              })}
            </DropdownMenu.Group>
          </Fragment>
        )}
      </NotificationContent>
    </DropdownMenu.Root>
  );
}
