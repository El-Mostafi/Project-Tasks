import ErrorPage from '../components/ErrorPage';

export default function ServerError() {
  return (
    <ErrorPage
      statusCode={500}
      title="Server Error"
      message="Something went wrong on our end. Please try again later or contact support if the problem persists."
      showHomeButton={true}
      showBackButton={true}
    />
  );
}

