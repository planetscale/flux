import styled from '@emotion/styled';
import { ButtonImage } from 'components/Button';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Content } from 'components/DropdownMenu';
import useSWR from 'swr';
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

const NotificationHeader = styled(DropdownMenu.Item)`
  display: flex;
  align-items: center;
  padding: 0px 24px;
  outline: none;
  justify-content: space-between;
`;

const NotificationContent = styled(Content)`
  width: 500px;
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

  const totalNotifications = newPosts.length + newComments.length;

  return (
    <DropdownMenu.Root>
      <NotificationButton as={DropdownMenu.Trigger}>
        <Icon className="icon-notification" />
      </NotificationButton>
      <NotificationContent sideOffset={42}>
        <DropdownMenu.Group>
          <NotificationHeader>
            <h3>Notifications ({totalNotifications})</h3>
            <ButtonTertiary disabled={!totalNotifications}>
              Clear all notifications
            </ButtonTertiary>
          </NotificationHeader>
        </DropdownMenu.Group>
        {totalNotifications === 0 && (
          <DropdownMenu.Group>
            <NotificationItem>
              You have no unread posts or comments.
            </NotificationItem>
          </DropdownMenu.Group>
        )}
        <DropdownMenu.Group>
          {newPosts.map(post => {
            return (
              <Link key={post.id} href={`/post/${post.id}`} passHref>
                <NotificationItem as="a">
                  <div className="label">New Post</div>
                  <div className="title">{post.title}</div>
                </NotificationItem>
              </Link>
            );
          })}
        </DropdownMenu.Group>
        <DropdownMenu.Group>
          {newComments.map(post => {
            return (
              <Link key={post.id} href={`/post/${post.id}`} passHref>
                <NotificationItem as="a">
                  <div className="label">
                    {post.numNewReplies} New Comment
                    {post.numNewReplies > 1 ? 's' : ''}
                  </div>
                  <div className="title">{post.title}</div>
                </NotificationItem>
              </Link>
            );
          })}
        </DropdownMenu.Group>
      </NotificationContent>
    </DropdownMenu.Root>
  );
}
