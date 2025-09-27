"use client"

import { useState } from 'react'
import { ContractDeployment } from '@/components/admin/contract-deployment'
import { KadenaEVMDeployment } from '@/components/admin/kadena-evm-deployment'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'pact' | 'evm'>('evm')

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === 'evm' ? 'default' : 'outline'}
            onClick={() => setActiveTab('evm')}
          >
            Kadena EVM (Solidity)
          </Button>
          <Button
            variant={activeTab === 'pact' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pact')}
          >
            Kadena Pact
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'evm' && <KadenaEVMDeployment />}
        {activeTab === 'pact' && <ContractDeployment />}
      </div>
    </div>
  )
}