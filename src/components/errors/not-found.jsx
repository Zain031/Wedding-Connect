import { Link, useRouteError } from 'react-router-dom'

function NotFound() {
  const error = useRouteError()
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold">{`Oops! ${error}`}</h1>
          <p className="py-6">
            The page you&apos;re looking for doesn&apos;t exist. It might have been removed or temporarily unavailable.
            Please try again later or contact our support if you need any help.
          </p>
          <button className="btn btn-secondary">
            <Link to="/">Back to Dashboard</Link>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
