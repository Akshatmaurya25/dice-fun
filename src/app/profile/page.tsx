"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWalletConnect } from "@/hooks/useWalletConnect"
import { FilecoinStorageService } from "@/lib/filecoin-storage"

// Akshat Maurya (akku dev) Profile Data
const userData = {
  name: "Akshat Maurya",
  nickname: "akku dev",
  ensName: "akkudev.eth",
  address: "0xA15h47M4uRy421337890abcdef1234567890abcdef",
  email: "akku.dev@protonmail.com",
  bio: "Full-stack developer & blockchain enthusiast 🚀 Building next-gen DeFi platforms on Kadena. Passionate about Web3, smart contracts, and creating innovative decentralized solutions. Streaming coding sessions, tech tutorials, and crypto insights.",
  avatar: "",
  isVerified: true,
  selfProtocolStatus: "verified",
  socialLinks: {
    twitter: "@akku_dev",
    github: "akkudev",
    website: "https://akkudev.xyz",
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    streamNotifications: true,
  },
  walletConnections: [
    {
      name: "MetaMask",
      address: "0x1234...5678",
      isActive: true,
      chain: "Polygon",
    },
    {
      name: "Kadena Wallet",
      address: "k:1234...5678",
      isActive: true,
      chain: "Kadena",
    },
  ],
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [profile, setProfile] = useState(userData)
  const [isEditing, setIsEditing] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarPieceCid, setAvatarPieceCid] = useState<string | null>(null)
  const [avatarUploadProgress, setAvatarUploadProgress] = useState<string>("")
  const wallet = useWalletConnect()

  const handleSwitchToKadena = async () => {
    if (wallet.switchToKadena) {
      try {
        const success = await wallet.switchToKadena()
        if (success) {
          alert('✅ Successfully switched to Kadena Chainweb EVM Testnet!')
        } else {
          alert('❌ Failed to switch to Kadena network')
        }
      } catch (error) {
        console.error('Failed to switch network:', error)
        alert('❌ Error switching to Kadena network')
      }
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB for profile pics)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB')
      return
    }

    try {
      setIsUploadingAvatar(true)
      setAvatarUploadProgress("Initializing Filecoin storage...")

      const storageService = FilecoinStorageService.getInstance()

      setAvatarUploadProgress("Converting image to upload format...")
      const fileData = await FilecoinStorageService.fileToUint8Array(file)

      setAvatarUploadProgress("Uploading to Filecoin network...")
      const result = await storageService.uploadFile(fileData, file.name)

      if (result.success) {
        setAvatarPieceCid(result.pieceCid)
        setAvatarUploadProgress(`✅ Uploaded to Filecoin! PieceCID: ${result.pieceCid.slice(0, 25)}...`)

        // Update profile with new avatar
        setProfile(prev => ({
          ...prev,
          avatar: result.pieceCid
        }))

        console.log(`🌍 Profile picture stored on Filecoin with PieceCID: ${result.pieceCid}`)

        // Show success message
        setTimeout(() => {
          alert(`✅ Profile picture uploaded to Filecoin!\n\nPieceCID: ${result.pieceCid}\n\nYour image is now permanently stored on the decentralized network!`)
        }, 1000)

      } else {
        setAvatarUploadProgress(`❌ Upload failed: ${result.error}`)
        console.error('Filecoin avatar upload failed:', result.error)
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setAvatarUploadProgress(`❌ Upload error: ${errorMessage}`)
      console.error('Avatar upload error:', error)
    } finally {
      setIsUploadingAvatar(false)
      // Clear progress after 5 seconds
      setTimeout(() => setAvatarUploadProgress(""), 5000)
    }
  }

  const handleSaveProfile = () => {
    // Save profile logic would go here
    setIsEditing(false)
  }

  const handleVerifyENS = () => {
    // ENS verification logic would go here
    console.log("Starting ENS verification...")
  }

  const handleSelfProtocolVerification = () => {
    // Self Protocol verification logic would go here
    console.log("Starting Self Protocol verification...")
  }

  const handleConnectWallet = (walletType: string) => {
    // Wallet connection logic would go here
    console.log(`Connecting ${walletType} wallet...`)
  }

  const handleDisconnectWallet = (address: string) => {
    // Wallet disconnection logic would go here
    console.log(`Disconnecting wallet ${address}...`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Profile & Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, preferences, and wallet connections
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Profile Information
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                        {profile.avatar && avatarPieceCid ? (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-600">Filecoin Image</span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-primary">
                            {profile.name[0]}{profile.name.split(' ')[1]?.[0] || ''}
                          </span>
                        )}
                      </div>

                      {avatarPieceCid && (
                        <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          🌍
                        </div>
                      )}

                      {isUploadingAvatar && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label htmlFor="avatar-upload">
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                              disabled={isUploadingAvatar}
                              asChild
                            >
                              <span>
                                {isUploadingAvatar ? 'Uploading...' : '🌍 Upload to Filecoin'}
                              </span>
                            </Button>
                          </label>
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                            disabled={isUploadingAvatar}
                          />
                          {avatarPieceCid && (
                            <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                              Stored on Filecoin
                            </Badge>
                          )}
                        </div>

                        {avatarUploadProgress && (
                          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            {avatarUploadProgress}
                          </div>
                        )}

                        {avatarPieceCid && (
                          <div className="text-xs text-gray-500">
                            <strong>PieceCID:</strong> {avatarPieceCid.slice(0, 30)}...
                          </div>
                        )}

                        <div className="text-xs text-gray-400">
                          Max 5MB • Images stored permanently on Filecoin
                          <br />
                          <span className="text-blue-600">ℹ️ Uses Filecoin Calibration testnet (independent of Kadena wallet)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Display Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      ) : (
                        <div className="text-sm bg-muted p-2 rounded">
                          <div className="font-medium">{profile.name}</div>
                          <div className="text-xs text-muted-foreground">aka &quot;{profile.nickname}&quot;</div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Email
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm bg-muted p-2 rounded">{profile.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full px-3 py-2 border border-input rounded-md text-sm min-h-20"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-sm bg-muted p-2 rounded">{profile.bio}</p>
                    )}
                  </div>

                  {/* Social Links */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Social Links
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-16 text-sm">Twitter:</span>
                        {isEditing ? (
                          <Input
                            value={profile.socialLinks.twitter}
                            onChange={(e) => setProfile({
                              ...profile,
                              socialLinks: { ...profile.socialLinks, twitter: e.target.value }
                            })}
                            className="flex-1"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {profile.socialLinks.twitter}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-16 text-sm">GitHub:</span>
                        {isEditing ? (
                          <Input
                            value={profile.socialLinks.github}
                            onChange={(e) => setProfile({
                              ...profile,
                              socialLinks: { ...profile.socialLinks, github: e.target.value }
                            })}
                            className="flex-1"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {profile.socialLinks.github}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-16 text-sm">Website:</span>
                        {isEditing ? (
                          <Input
                            value={profile.socialLinks.website}
                            onChange={(e) => setProfile({
                              ...profile,
                              socialLinks: { ...profile.socialLinks, website: e.target.value }
                            })}
                            className="flex-1"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {profile.socialLinks.website}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Stats */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">3,247</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">87</div>
                    <div className="text-sm text-muted-foreground">Total Streams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">542.89</div>
                    <div className="text-sm text-muted-foreground">MATIC Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">156</div>
                    <div className="text-sm text-muted-foreground">Hours Streamed</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ENS Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>ENS Name</span>
                  <Badge variant="outline">{profile.ensName}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  {profile.isVerified ? (
                    <Badge className="bg-green-500 hover:bg-green-600">✓ Verified</Badge>
                  ) : (
                    <Badge variant="outline">Not Verified</Badge>
                  )}
                </div>
                {!profile.isVerified && (
                  <Button onClick={handleVerifyENS} className="w-full">
                    Verify ENS Name
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Self Protocol</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Verification Status</span>
                  {profile.selfProtocolStatus === "verified" ? (
                    <Badge className="bg-green-500 hover:bg-green-600">✓ Verified</Badge>
                  ) : profile.selfProtocolStatus === "pending" ? (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                      ⏳ Pending
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not Started</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Self Protocol verification provides additional trust and credibility for your streams.
                </p>
                {profile.selfProtocolStatus !== "verified" && (
                  <Button onClick={handleSelfProtocolVerification} className="w-full">
                    {profile.selfProtocolStatus === "pending" ? "Check Status" : "Start Verification"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Wallets Tab */}
        <TabsContent value="wallets" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Connected Wallets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.walletConnections.map((wallet, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{wallet.name}</h4>
                    <p className="text-sm text-muted-foreground font-mono">
                      {wallet.address}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {wallet.chain}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {wallet.isActive && (
                      <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectWallet(wallet.address)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Network Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Button
                      onClick={handleSwitchToKadena}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      🔗 Switch to Kadena Testnet
                    </Button>
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      {wallet.chainId === 5920 ? (
                        <span className="text-green-600">✅ Connected to Kadena</span>
                      ) : (
                        <span className="text-orange-600">⚠️ Not on Kadena network</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Connect New Wallet</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleConnectWallet("MetaMask")}
                    >
                      Connect MetaMask
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleConnectWallet("WalletConnect")}
                    >
                      Connect WalletConnect
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(profile.preferences).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <Button
                      variant={value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, [key]: !value }
                      })}
                    >
                      {value ? "On" : "Off"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  🔒 Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🔐 Enable 2FA
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📱 Download Data
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  🗑️ Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}