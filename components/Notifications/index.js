import styled from '@emotion/styled';
import * as DropdownMenu from 'components/DropdownMenu';
import useSWR, { mutate } from 'swr';
import { fetcher } from 'utils/fetch';
import { ButtonWireframe } from 'components/Button';
import { Notification2, Close } from '@styled-icons/remix-line';
import Link from 'next/link';
import { Fragment } from 'react/cjs/react.production.min';

const NotificationHeader = styled(DropdownMenu.SimpleItem)`
  display: flex;
  align-items: center;
  padding: 1em;
  outline: none;
  justify-content: space-between;
`;

const NotificationHeaderTitle = styled.div`
  font-size: var(--fs-base);
`;

const NotificationContent = styled(DropdownMenu.Content)`
  width: 500px;
  max-height: 80vh;
  overflow: auto;
`;

const NotificationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1em;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border-primary);
  }

  &:hover {
    cursor: pointer;
    background-color: var(--bg-secondary);
  }
`;

const NotificationItem = styled(DropdownMenu.Item)`
  display: block;
  outline: none;
  text-decoration: none;
  color: inherit !important;

  .label {
    padding-bottom: 4px;
    font-size: var(--fs-base-minus-2);
    color: var(--text-secondary);
  }

  .title {
    font-size: var(--fs-base);
  }
`;

const EmptyNotificationItem = styled(DropdownMenu.SimpleItem)`
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  font-size: var(--fs-base-minus-1);
  color: var(--text-secondary);
  font-weight: 300;
`;

const HoverIcon = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px 8px;
  border-radius: var(--border-radius);

  > svg {
    width: 1em;
    height: 1em;
    color: var(--text-primary);
  }

  &:hover {
    cursor: pointer;
    background-color: rgba(var(--blue-500), 0.25);
  }
`;

export default function Notifications() {
  const { data } = useSWR(['/api/get-notifications'], url =>
    fetcher('GET', url)
  );
  if (!data) {
    return (
      <ButtonWireframe>
        <Notification2 />
      </ButtonWireframe>
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
      <ButtonWireframe
        as={DropdownMenu.Trigger}
        className={totalNotifications > 0 ? 'has-notifications' : ''}
      >
        <Notification2 />
      </ButtonWireframe>
      <NotificationContent sideOffset={42}>
        {totalNotifications === 0 ? (
          <DropdownMenu.Group>
            <EmptyNotificationItem>
              😶 No notifications for you.
            </EmptyNotificationItem>
          </DropdownMenu.Group>
        ) : (
          <Fragment>
            <DropdownMenu.Group>
              <NotificationHeader>
                <NotificationHeaderTitle>
                  Notifications ({totalNotifications})
                </NotificationHeaderTitle>
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
                    <HoverIcon onClick={() => clearNotification(notification)}>
                      <Close />
                    </HoverIcon>
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
                    <HoverIcon onClick={() => clearNotification(notification)}>
                      <Close />
                    </HoverIcon>
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
