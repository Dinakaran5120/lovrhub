import { useNotifications } from '@/context/NotificationContext';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import {
  Bell,
  Crown,
  Eye,
  EyeOff,
  Heart,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  Users,
  X,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LovrHubLogo } from './LovrHubLogo';

type HeaderProps = {
  notificationCount?: number; // kept for backwards compat; ignored — context drives the badge
  showNotifications?: boolean;
  isLoggedIn?: boolean;
};

const notifIconMap: Record<string, string> = {
  like:          '❤️',
  comment:       '💬',
  follow:        '👥',
  join_request:  '🔔',
  join_approved: '✅',
};

export function Header({ showNotifications = true, isLoggedIn = true }: HeaderProps) {
  const T = useTheme();
  const router = useRouter();
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const STATUS_BAR_HEIGHT =
    Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 24) : 44;

  const handleLogout = () => { setMenuOpen(false); router.push('/welcome'); };
  const handleAccount = () => { setMenuOpen(false); router.push('/(tabs)/account'); };
  const handlePremium = () => { setMenuOpen(false); alert('Premium features coming soon! 👑'); };

  const openNotifications = () => {
    setNotifOpen(true);
    markAllRead();
  };

  return (
    <>
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingTop: STATUS_BAR_HEIGHT + 12,
          paddingBottom: 16,
          backgroundColor: T.bg,
        }}
      >
        {/* Logo */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <LovrHubLogo size={38} useGradient />
          <Text style={{ fontSize: 20, fontWeight: '800', color: T.text, letterSpacing: 0.3 }}>
            LovrHub
          </Text>
        </View>

        {/* Right actions */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          {showNotifications && (
            <TouchableOpacity
              onPress={openNotifications}
              style={{ position: 'relative' }}
            >
              <Bell color={T.text} size={24} />
              {unreadCount > 0 && (
                <View style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 18, height: 18, borderRadius: 9,
                  backgroundColor: T.primary,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setMenuOpen(true)}>
            <Menu color={T.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Hamburger Menu Modal ─────────────────────────────────────────── */}
      <Modal visible={menuOpen} animationType="slide" transparent onRequestClose={() => setMenuOpen(false)}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setMenuOpen(false)}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              borderTopLeftRadius: 28, borderTopRightRadius: 28,
              padding: 28, backgroundColor: T.card,
            }}
            onPress={e => e.stopPropagation()}
          >
            {/* Drag handle */}
            <View style={{ width: 40, height: 4, backgroundColor: T.border, borderRadius: 2, alignSelf: 'center', marginBottom: 22 }} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: T.text }}>Menu</Text>
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <X color={T.textMuted} size={22} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 10 }}>
              {/* Theme Toggle */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, backgroundColor: T.cardAlt }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: T.isDark ? '#E63946' : '#F4C430' }}>
                    <Text style={{ fontSize: 20 }}>{T.isDark ? '🌙' : '☀️'}</Text>
                  </View>
                  <View>
                    <Text style={{ fontWeight: '600', color: T.text }}>{T.isDark ? 'Dark Mode' : 'Light Mode'}</Text>
                    <Text style={{ fontSize: 12, color: T.textMuted }}>Switch theme</Text>
                  </View>
                </View>
                <ThemeSwitch />
              </View>

              {/* Account Settings */}
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: T.cardAlt }} onPress={handleAccount}>
                <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF8C6B22' }}>
                  <Settings color="#FF8C6B" size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', color: T.text }}>Account Settings</Text>
                  <Text style={{ fontSize: 12, color: T.textMuted }}>Manage your account</Text>
                </View>
              </TouchableOpacity>

              {/* Profile Visibility */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, backgroundColor: T.cardAlt }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2ECC7122' }}>
                    {isPublic ? <Eye color="#2ECC71" size={20} /> : <EyeOff color="#2ECC71" size={20} />}
                  </View>
                  <View>
                    <Text style={{ fontWeight: '600', color: T.text }}>Profile Visibility</Text>
                    <Text style={{ fontSize: 12, color: T.textMuted }}>{isPublic ? 'Public' : 'Private'}</Text>
                  </View>
                </View>
                <Switch value={isPublic} onValueChange={setIsPublic} trackColor={{ false: T.border, true: '#2ECC71' }} thumbColor="#fff" />
              </View>

              {/* Premium */}
              <TouchableOpacity
                onPress={handlePremium}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: '#F59E0B' }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.25)' }}>
                  <Crown color="#fff" size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', color: '#fff' }}>Switch to Premium</Text>
                  <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>Unlock exclusive features</Text>
                </View>
              </TouchableOpacity>

              {/* Logout */}
              {isLoggedIn && (
                <TouchableOpacity
                  onPress={handleLogout}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: T.primary }}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <LogOut color="#fff" size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', color: '#fff' }}>Logout</Text>
                    <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>Sign out of your account</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ height: 28 }} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── Notifications Panel ───────────────────────────────────────────── */}
      <Modal visible={notifOpen} animationType="slide" transparent onRequestClose={() => setNotifOpen(false)}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setNotifOpen(false)}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              borderTopLeftRadius: 28, borderTopRightRadius: 28,
              backgroundColor: T.card, maxHeight: '80%',
            }}
            onPress={e => e.stopPropagation()}
          >
            <View style={{ padding: 28, paddingBottom: 0 }}>
              <View style={{ width: 40, height: 4, backgroundColor: T.border, borderRadius: 2, alignSelf: 'center', marginBottom: 22 }} />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <Text style={{ color: T.text, fontSize: 22, fontWeight: 'bold' }}>Notifications</Text>
                <TouchableOpacity onPress={() => setNotifOpen(false)}>
                  <X color={T.textMuted} size={22} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 10 }}>
              {notifications.length === 0 && (
                <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                  <Bell size={40} color={T.border} />
                  <Text style={{ color: T.textMuted, marginTop: 12, fontSize: 15 }}>No notifications yet</Text>
                </View>
              )}
              {notifications.map(n => (
                <TouchableOpacity
                  key={n.id}
                  onPress={() => markRead(n.id)}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 14,
                    backgroundColor: n.read ? T.card : T.cardAlt,
                    borderRadius: 16, padding: 14,
                    borderWidth: n.read ? 0 : 1, borderColor: T.primary + '40',
                  }}
                >
                  {n.avatar ? (
                    <Image source={{ uri: n.avatar }} style={{ width: 44, height: 44, borderRadius: 22 }} />
                  ) : (
                    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: T.cardAlt, alignItems: 'center', justifyContent: 'center' }}>
                      {n.type === 'like'          && <Heart size={22} color={T.primary} />}
                      {n.type === 'comment'       && <MessageCircle size={22} color="#a855f7" />}
                      {n.type === 'follow'        && <Users size={22} color="#2ECC71" />}
                      {n.type === 'join_request'  && <Bell size={22} color="#F59E0B" />}
                      {n.type === 'join_approved' && <Crown size={22} color="#F59E0B" />}
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: T.text, fontSize: 14, fontWeight: n.read ? '400' : '600', lineHeight: 20 }}>
                      {n.message}
                    </Text>
                    <Text style={{ color: T.textMuted, fontSize: 12, marginTop: 3 }}>{n.time}</Text>
                  </View>
                  {!n.read && (
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.primary }} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

// Inline animated theme switch
function ThemeSwitch() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  return (
    <Switch
      value={isDark}
      onValueChange={toggleColorScheme}
      trackColor={{ false: '#d4d4d8', true: '#E63946' }}
      thumbColor="#fff"
    />
  );
}
