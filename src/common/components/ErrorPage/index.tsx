import { ErrorComponentProps } from '@tanstack/react-router';

export default function ErrorPage(props: ErrorComponentProps) {
  return (
    <>
      <h1>Error!</h1>
      <p>{props.error.message}</p>
    </>
  );
}
