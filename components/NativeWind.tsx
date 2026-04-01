// This file provides cssInterop-wrapped components for NativeWind className support
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Bookmark,
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Crop,
  Crown,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Heart,
  HelpCircle,
  Lock,
  LogOut,
  Image as LucideImage,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Plus,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  Smartphone,
  Star,
  Trash2,
  TrendingUp,
  Unlock,
  Upload,
  User,
  Users,
  Video,
  X,
  Zap,
} from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { Image, Modal, Pressable, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


// Wrap React Native components for className support
export const StyledView = cssInterop(View, {
  className: {
    target: 'style',
  },
});

export const StyledText = cssInterop(Text, {
  className: {
    target: 'style',
  },
});

export const StyledImage = cssInterop(Image, {
  className: {
    target: 'style',
  },
});

export const StyledScrollView = cssInterop(ScrollView, {
  className: {
    target: 'style',
  },
});

export const StyledSafeAreaView = cssInterop(SafeAreaView, {
  className: {
    target: 'style',
  },
});

export const StyledTouchableOpacity = cssInterop(TouchableOpacity, {
  className: {
    target: 'style',
  },
});

export const StyledModal = cssInterop(Modal, {
  className: {
    target: 'style',
  },
});

export const StyledSwitch = cssInterop(Switch, {
  className: {
    target: 'style',
  },
});

export const StyledPressable = cssInterop(Pressable, {
  className: {
    target: 'style',
  },
});

export const StyledTextInput = cssInterop(TextInput, {
  className: {
    target: 'style',
  },
});

// Wrap Lucide icons for className support
export const ArrowLeftIcon = cssInterop(ArrowLeft, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const MailIcon = cssInterop(Mail, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const SmartphoneIcon = cssInterop(Smartphone, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});
export const MenuIcon = cssInterop(Menu, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const HeartIcon = cssInterop(Heart, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const MessageCircleIcon = cssInterop(MessageCircle, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const UploadIcon = cssInterop(Upload, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const CompassIcon = cssInterop(Compass, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const UserIcon = cssInterop(User, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const SettingsIcon = cssInterop(Settings, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const ChevronRightIcon = cssInterop(ChevronRight, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const CrownIcon = cssInterop(Crown, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const FileTextIcon = cssInterop(FileText, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const HelpCircleIcon = cssInterop(HelpCircle, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const LockIcon = cssInterop(Lock, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const LogOutIcon = cssInterop(LogOut, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const MoonIcon = cssInterop(Moon, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const ShieldIcon = cssInterop(Shield, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const StarIcon = cssInterop(Star, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const Trash2Icon = cssInterop(Trash2, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const UnlockIcon = cssInterop(Unlock, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const SearchIcon = cssInterop(Search, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const BellIcon = cssInterop(Bell, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const MapPinIcon = cssInterop(MapPin, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const Share2Icon = cssInterop(Share2, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const BookmarkIcon = cssInterop(Bookmark, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const SendIcon = cssInterop(Send, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const XIcon = cssInterop(X, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const PlusIcon = cssInterop(Plus, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const FilterIcon = cssInterop(Filter, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const EyeIcon = cssInterop(Eye, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const EyeOffIcon = cssInterop(EyeOff, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const CheckIcon = cssInterop(Check, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const AlertCircleIcon = cssInterop(AlertCircle, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const ClockIcon = cssInterop(Clock, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const CalendarIcon = cssInterop(Calendar, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const ZapIcon = cssInterop(Zap, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const TrendingUpIcon = cssInterop(TrendingUp, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const CameraIcon = cssInterop(Camera, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const ChevronLeftIcon = cssInterop(ChevronLeft, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const CropIcon = cssInterop(Crop, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const VideoIcon = cssInterop(Video, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const ImageIcon = cssInterop(LucideImage, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});

export const UsersIcon = cssInterop(Users, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true },
  },
});
