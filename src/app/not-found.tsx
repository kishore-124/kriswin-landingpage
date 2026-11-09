import Link from "next/link";

export default function NotFound() {
  return (
    <div className="login-wrap text-center text-white">
      <div>
        <div className="display-1 fw-bold">404</div>
        <p className="fs-5 text-white-50 mb-4">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn btn-brand btn-lg">Back to home</Link>
      </div>
    </div>
  );
}
