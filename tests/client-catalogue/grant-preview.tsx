import { createRoot } from 'react-dom/client'
import PackageGrantPanel from '../../src/pages/admin/members/PackageGrantPanel'
import '../../src/index.css'

createRoot(document.getElementById('root')!).render(
  <main className="mx-auto max-w-5xl p-4">
    <PackageGrantPanel memberId="synthetic-member" memberEmail="client@example.test" token="synthetic-token" onGranted={() => {}} />
  </main>,
)
