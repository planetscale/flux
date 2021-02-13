import styled from '@emotion/styled';

const Icon = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  background: var(--foreground);
  mask-size: cover;

  &.icon-system {
    mask: url('/icon_system.svg');
  }

  &.icon-light {
    mask: url('/icon_light.svg');
  }

  &.icon-dark {
    mask: url('/icon_dark.svg');
  }

  &.icon-plus {
    mask: url('/icon_plus.svg');
  }

  &.icon-comment {
    mask: url('/icon_comment.svg');
  }

  &.icon-post {
    mask: url('/icon_post.svg');
  }

  &.icon-star {
    mask: url('/icon_star.svg');
  }

  &.icon-edit {
    mask: url('/icon_edit.svg');
  }

  &.icon-google {
    mask: url('/logo_google.svg');
  }
`;

export { Icon };
