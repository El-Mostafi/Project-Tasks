import ErrorPage from '../components/ErrorPage';

export default function Forbidden() {
  return (
    <ErrorPage
      statusCode={403}
      title="Access Forbidden"
      message="You don't have permission to access this resource. Please contact your administrator if you believe this is an error."
      showHomeButton={true}
      showBackButton={false}
    />
  );
}

