import styled from '@emotion/styled';

const Icon = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  background: var(--foreground);
  -webkit-mask-size: cover;
  -webkit-mask-repeat: no-repeat;

  &.icon-system {
    mask-image: url('/icon_system.svg');
  }

  &.icon-light {
    mask-image: url('/icon_light.svg');
  }

  &.icon-dark {
    mask-image: url('/icon_dark.svg');
  }

  &.icon-plus {
    mask-image: url('/icon_plus.svg');
  }

  &.icon-comment {
    mask-image: url('/icon_comment.svg');
  }

  &.icon-post {
    mask-image: url('/icon_post.svg');
  }

  &.icon-star {
    mask-image: url('/icon_star.svg');
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
`;

export { Icon };
