import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    User, Mail, Lock, Camera, Bell, Globe2, Moon, Sun,
    Shield, Key, Trash2, Save, Check
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const ProfileSettings = () => {
    const { user, updateUser, logout } = useAuth()

    const [activeTab, setActiveTab] = useState('profile')
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        avatar: user?.avatar || '',
        currency: 'INR',
        language: 'en',
        notifications: {
            email: true,
            push: true,
            tripReminders: true,
            weeklyDigest: false
        },
        theme: 'dark'
    })
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        const result = await updateUser(formData)
        if (result.success) {
            toast.success('Profile updated successfully!')
        } else {
            toast.error(result.error)
        }
        setLoading(false)
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'preferences', label: 'Preferences', icon: Globe2 },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="mb-8">
                <h1 className="heading-lg mb-2">Settings</h1>
                <p className="text-white/60">Manage your account and preferences</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="glass-card p-4 h-fit">
                    <nav className="space-y-1">
                        {tabs.map(tab => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ x: 5 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary-400' : ''}`} />
                                {tab.label}
                            </motion.button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="md:col-span-3 glass-card p-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

                            {/* Avatar */}
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <img
                                        src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=ff2d5e&color=fff&size=128`}
                                        alt="Avatar"
                                        className="w-24 h-24 rounded-2xl object-cover"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </motion.button>
                                </div>
                                <div>
                                    <h3 className="font-semibold">{formData.name}</h3>
                                    <p className="text-sm text-white/50">{formData.email}</p>
                                    <p className="text-xs text-white/30 mt-1">Member since Jan 2026</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input-glass pl-12"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="input-glass pl-12"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Avatar URL</label>
                                <input
                                    type="url"
                                    value={formData.avatar}
                                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                    placeholder="https://..."
                                    className="input-glass"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-semibold mb-6">Preferences</h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Currency</label>
                                    <select
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                        className="input-glass"
                                    >
                                        <option value="INR">₹ Indian Rupee (INR)</option>
                                        <option value="USD">$ US Dollar (USD)</option>
                                        <option value="EUR">€ Euro (EUR)</option>
                                        <option value="GBP">£ British Pound (GBP)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Language</label>
                                    <select
                                        value={formData.language}
                                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                        className="input-glass"
                                    >
                                        <option value="en">English</option>
                                        <option value="hi">Hindi</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-4">Theme</label>
                                <div className="flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setFormData({ ...formData, theme: 'dark' })}
                                        className={`flex-1 p-4 rounded-xl flex items-center justify-center gap-2 ${formData.theme === 'dark'
                                                ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/50'
                                                : 'bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <Moon className="w-5 h-5" />
                                        Dark
                                        {formData.theme === 'dark' && <Check className="w-4 h-4 text-primary-400 ml-2" />}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setFormData({ ...formData, theme: 'light' })}
                                        className={`flex-1 p-4 rounded-xl flex items-center justify-center gap-2 ${formData.theme === 'light'
                                                ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/50'
                                                : 'bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <Sun className="w-5 h-5" />
                                        Light
                                        {formData.theme === 'light' && <Check className="w-4 h-4 text-primary-400 ml-2" />}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>

                            <div className="space-y-4">
                                {[
                                    { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                                    { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                                    { key: 'tripReminders', label: 'Trip Reminders', desc: 'Get reminded about upcoming trips' },
                                    { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of your trips' },
                                ].map(item => (
                                    <div
                                        key={item.key}
                                        className="flex items-center justify-between p-4 rounded-xl bg-white/5"
                                    >
                                        <div>
                                            <h4 className="font-medium">{item.label}</h4>
                                            <p className="text-sm text-white/50">{item.desc}</p>
                                        </div>
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setFormData({
                                                ...formData,
                                                notifications: {
                                                    ...formData.notifications,
                                                    [item.key]: !formData.notifications[item.key]
                                                }
                                            })}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${formData.notifications[item.key] ? 'bg-primary-500' : 'bg-white/20'
                                                }`}
                                        >
                                            <motion.div
                                                animate={{
                                                    x: formData.notifications[item.key] ? 24 : 2
                                                }}
                                                className="absolute top-1 w-4 h-4 rounded-full bg-white"
                                            />
                                        </motion.button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-semibold mb-6">Security</h2>

                            <div className="p-4 rounded-xl bg-white/5">
                                <div className="flex items-center gap-3 mb-4">
                                    <Key className="w-5 h-5 text-primary-400" />
                                    <h4 className="font-medium">Change Password</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-white/70 mb-2">Current Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                            <input type="password" className="input-glass pl-12" placeholder="••••••••" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/70 mb-2">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                            <input type="password" className="input-glass pl-12" placeholder="••••••••" />
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-secondary"
                                    >
                                        Update Password
                                    </motion.button>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                                <div className="flex items-center gap-3 mb-4">
                                    <Trash2 className="w-5 h-5 text-red-400" />
                                    <h4 className="font-medium text-red-400">Danger Zone</h4>
                                </div>
                                <p className="text-sm text-white/60 mb-4">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                >
                                    Delete Account
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end mt-8 pt-6 border-t border-white/10">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            disabled={loading}
                            className="btn-primary flex items-center gap-2"
                        >
                            {loading ? (
                                <div className="spinner w-5 h-5" />
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default ProfileSettings
