import styled from '@emotion/styled';
import { ButtonImage } from 'components/Button';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Content, Item } from 'components/DropdownMenu';
import useSWR, { mutate } from 'swr';
import { fetcher } from 'utils/fetch';
import { ButtonTertiary } from 'components/Button';
import { Icon } from 'pageUtils/post/atoms';
import Link from 'next/link';

const NotificationButton = styled(ButtonImage)`
  border-radius: 50%;
  background-color: #e55e31;

  ${Icon} {
    background: white;
  }
`;

const NotificationHeader = styled(Item)`
  display: flex;
  align-items: center;
  padding: 0px 24px;
  outline: none;
  justify-content: space-between;
`;

const NotificationContent = styled(Content)`
  width: 500px;
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

const EmptyNotificationItem = styled(Item)`
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: italic;
  outline: none;
`;

const HoverIcon = styled(Icon)`
  position: absolute;
  top: calc(50% - 12px);
  right: 24px;
  transition: all 150ms;
  &:hover {
    cursor: pointer;
    transform: scale(1.15);
  }
`;

export default function Notifications() {
  const { data } = useSWR(['/api/get-notifications'], url =>
    fetcher('GET', url)
  );
  if (!data) {
    return (
      <NotificationButton>
        <Icon className="icon-notification" />
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
      <NotificationButton as={DropdownMenu.Trigger}>
        <Icon className="icon-notification" />
      </NotificationButton>
      <NotificationContent sideOffset={42}>
        <DropdownMenu.Group>
          <NotificationHeader>
            <h3>Notifications ({totalNotifications})</h3>
            <ButtonTertiary
              disabled={!totalNotifications}
              onClick={clearAllNotifications}
            >
              Clear all notifications
            </ButtonTertiary>
          </NotificationHeader>
        </DropdownMenu.Group>
        {totalNotifications === 0 && (
          <DropdownMenu.Group>
            <EmptyNotificationItem>No new notifications</EmptyNotificationItem>
          </DropdownMenu.Group>
        )}
        <DropdownMenu.Group>
          {newPosts.map(notification => {
            return (
              <NotificationWrapper>
                <Link
                  key={notification.postId}
                  href={`/post/${notification.postId}`}
                  passHref
                >
                  <NotificationItem as="a">
                    <div className="label">New Post</div>
                    <div className="title">{notification.postTitle}</div>
                  </NotificationItem>
                </Link>
                <HoverIcon
                  className="icon-cancel"
                  onClick={() => clearNotification(notification)}
                ></HoverIcon>
              </NotificationWrapper>
            );
          })}
        </DropdownMenu.Group>
        <DropdownMenu.Group>
          {newComments.map(notification => {
            return (
              <NotificationWrapper>
                <Link
                  key={notification.postId}
                  href={`/post/${notification.postId}`}
                  passHref
                >
                  <NotificationItem as="a">
                    <div className="label">
                      {notification.numNewReplies} New Comment
                      {notification.numNewReplies > 1 ? 's' : ''}
                    </div>
                    <div className="title">{notification.postTitle}</div>
                  </NotificationItem>
                </Link>
                <HoverIcon
                  className="icon-cancel"
                  onClick={() => clearNotification(notification)}
                ></HoverIcon>
              </NotificationWrapper>
            );
          })}
        </DropdownMenu.Group>
      </NotificationContent>
    </DropdownMenu.Root>
  );
}
