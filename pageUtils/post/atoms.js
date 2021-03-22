import styled from '@emotion/styled';

const Icon = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  background: var(--text-primary);
  -webkit-mask-size: cover;
  -webkit-mask-repeat: no-repeat;

  &.icon-plus {
    mask-image: url('/icon_plus.svg');
  }

  &.icon-comment {
    mask-image: url('/icon_comment.svg');
  }

  &.icon-post {
    mask-image: url('/icon_post.svg');
  }

  &.icon-edit {
    mask-image: url('/icon_edit.svg');
  }

  &.icon-notification {
    mask-image: url('/icon_notifications.svg');
  }

  &.icon-google {
    mask: url('/logo_google.svg');
  }

  &.icon-cancel {
    mask: url('/icon_cancel.svg');
  }
`;

export { Icon };
