"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWalletConnect } from "@/hooks/useWalletConnect"

interface WalletProvider {
  isMetaMask?: boolean
  isPhantom?: boolean
  isCoinbaseWallet?: boolean
}

interface EthereumProvider {
  isMetaMask?: boolean
  isPhantom?: boolean
  providers?: WalletProvider[]
  request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  on?: (event: string, callback: (data: unknown) => void) => void
  send?: (method: string, params: unknown[]) => Promise<string[]>
}

interface WalletInfo {
  hasEthereum?: boolean
  isMetaMask?: boolean
  isPhantom?: boolean
  hasProviders?: boolean
  providersCount?: number
  providers?: WalletProvider[]
}

export default function WalletDebugPage() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({})
  const wallet = useWalletConnect()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ethereum = (window as unknown as { ethereum?: EthereumProvider }).ethereum
      const info = {
        hasEthereum: !!ethereum,
        isMetaMask: !!ethereum?.isMetaMask,
        isPhantom: !!ethereum?.isPhantom,
        hasProviders: !!ethereum?.providers,
        providersCount: ethereum?.providers?.length || 0,
        providers: ethereum?.providers?.map((p: WalletProvider) => ({
          isMetaMask: p.isMetaMask,
          isPhantom: p.isPhantom,
          isCoinbaseWallet: p.isCoinbaseWallet,
        })) || []
      }
      setWalletInfo(info)
    }
  }, [])

  const handleConnect = async () => {
    const success = await wallet.connectWallet()
    console.log('Connection result:', success)
  }

  const handleDisconnect = async () => {
    await wallet.disconnectWallet()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Wallet Detection Debug</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Wallet Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Ready:</span>
              <Badge variant={wallet.isReady ? "default" : "secondary"}>
                {wallet.isReady.toString()}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Loading:</span>
              <Badge variant={wallet.isLoading ? "destructive" : "outline"}>
                {wallet.isLoading.toString()}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Connected:</span>
              <Badge variant={wallet.isConnected ? "default" : "secondary"}>
                {wallet.isConnected.toString()}
              </Badge>
            </div>
            {wallet.address && (
              <div>
                <span>Address:</span>
                <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
                  {wallet.address}
                </div>
              </div>
            )}
            {wallet.chainId && (
              <div className="flex justify-between">
                <span>Chain ID:</span>
                <Badge variant="outline">{wallet.chainId}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Browser Wallet Detection */}
        <Card>
          <CardHeader>
            <CardTitle>Browser Wallet Detection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Has window.ethereum:</span>
              <Badge variant={walletInfo.hasEthereum ? "default" : "destructive"}>
                {walletInfo.hasEthereum?.toString()}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Is MetaMask:</span>
              <Badge variant={walletInfo.isMetaMask ? "default" : "secondary"}>
                {walletInfo.isMetaMask?.toString()}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Is Phantom:</span>
              <Badge variant={walletInfo.isPhantom ? "destructive" : "outline"}>
                {walletInfo.isPhantom?.toString()}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Has Multiple Providers:</span>
              <Badge variant={walletInfo.hasProviders ? "default" : "outline"}>
                {walletInfo.hasProviders?.toString()}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Providers Count:</span>
              <Badge variant="outline">{walletInfo.providersCount}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Provider Details */}
        {walletInfo.providers && walletInfo.providers.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Detected Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {walletInfo.providers.map((provider: WalletProvider, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <span>Provider {index + 1}</span>
                    <div className="flex gap-2">
                      {provider.isMetaMask && (
                        <Badge className="bg-orange-500 hover:bg-orange-600">🦊 MetaMask</Badge>
                      )}
                      {provider.isPhantom && (
                        <Badge className="bg-purple-500 hover:bg-purple-600">👻 Phantom</Badge>
                      )}
                      {provider.isCoinbaseWallet && (
                        <Badge className="bg-blue-500 hover:bg-blue-600">🔵 Coinbase</Badge>
                      )}
                      {!provider.isMetaMask && !provider.isPhantom && !provider.isCoinbaseWallet && (
                        <Badge variant="outline">Unknown</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Wallet Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              {!wallet.isConnected ? (
                <Button
                  onClick={handleConnect}
                  disabled={wallet.isLoading}
                  size="lg"
                  className="flex-1"
                >
                  {wallet.isLoading ? 'Connecting...' : 'Connect MetaMask'}
                </Button>
              ) : (
                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Disconnect Wallet
                </Button>
              )}
            </div>

            {walletInfo.isPhantom && !walletInfo.isMetaMask && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">⚠️ Phantom Detected</h4>
                <p className="text-sm text-yellow-700">
                  Phantom wallet is overriding the ethereum provider. For best results with this dApp:
                </p>
                <ol className="text-sm text-yellow-700 mt-2 ml-4 list-decimal">
                  <li>Install MetaMask browser extension</li>
                  <li>Disable or remove Phantom extension temporarily</li>
                  <li>Refresh the page</li>
                </ol>
              </div>
            )}

            {walletInfo.isMetaMask && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">✅ MetaMask Ready</h4>
                <p className="text-sm text-green-700">
                  MetaMask is properly detected and ready to use!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}