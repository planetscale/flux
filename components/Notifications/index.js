import styled from '@emotion/styled';
import { ButtonImage } from 'components/Button';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Content } from 'components/DropdownMenu';
import useSWR from 'swr';
import { fetcher } from 'utils/fetch';
import { ButtonMinor } from 'components/Button';

const NotificationHeader = styled(DropdownMenu.Item)`
  display: flex;
  align-items: center;
  padding: 0px 24px;
  outline: none;
  justify-content: space-between;
`;

const NotificationContent = styled(Content)`
  width: 600px;
`;

const NotificationItem = styled(DropdownMenu.Item)`
  display: block;
  padding: 12px 24px;
  outline: none;
  text-decoration: none;
  color: inherit !important;

  &:hover {
    cursor: pointer;
    background-color: var(--highlight);
    color: white;
  }

  .label {
    font-style: italic;
  }
  .title {
    font-weight: bold;
  }
`;

export default function Notifications() {
  const { data } = useSWR(['/api/get-notifications'], url =>
    fetcher('GET', url, {}, notifications => {
      let newPosts = [];
      let newComments = [];
      notifications.forEach(notif => {
        if (notif.isNewPost) {
          newPosts.push(notif);
        } else {
          newComments.push(notif);
        }
      });
      return { newPosts, newComments };
    })
  );

  if (!data) {
    return null;
  }

  const { newPosts, newComments } = data;

  return (
    <DropdownMenu.Root>
      <ButtonImage as={DropdownMenu.Trigger}>
        <img src="/icon_notifications.svg" alt="View notifications." />
      </ButtonImage>
      <NotificationContent sideOffset={42}>
        <DropdownMenu.Group>
          <NotificationHeader>
            <h3>Notications</h3>
            <ButtonMinor>Clear all</ButtonMinor>
          </NotificationHeader>
        </DropdownMenu.Group>
        <DropdownMenu.Group>
          {newPosts.map(post => {
            return (
              <NotificationItem as="a" key={post.id} href={`/post/${post.id}`}>
                <div className="title">{post.title}</div>
                <div className="label">New Post</div>
              </NotificationItem>
            );
          })}
        </DropdownMenu.Group>
        <DropdownMenu.Group>
          {newComments.map(post => {
            return (
              <NotificationItem as="a" key={post.id} href={`/post/${post.id}`}>
                <div className="title">{post.title}</div>
                <div className="label">{post.numNewReplies} new comments</div>
              </NotificationItem>
            );
          })}
        </DropdownMenu.Group>
      </NotificationContent>
    </DropdownMenu.Root>
  );
}
