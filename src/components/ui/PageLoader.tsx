import Spinner from './Spinner'

export default function PageLoader() {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner />

        <p className="text-sm text-slate-500">
          Loading...
        </p>
      </div>
    </div>
  )
}