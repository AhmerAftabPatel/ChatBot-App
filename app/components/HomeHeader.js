import { View, Text, Platform } from 'react-native'
import { Image } from 'expo-image';
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { blurhash } from '../../utils/constants';
import { useAuth } from '../../context/authContext';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { MenuItem } from './CustomerMenu';
import { AntDesign, Feather } from '@expo/vector-icons';


const ios = Platform.OS == "ios"
export default function HomeHeader() {
    const { top } = useSafeAreaInsets();
    const { user, logout } = useAuth();

    const handleProfileClick = () => {

    }

    const handleLogout = async () => {
        await logout()
    }
    return (
        <View style={{ paddingTop: ios ? top + 10 : top + 10 }} className="flex-row justify-between px-5 bg-orange-400 pb-5 shadow">
            <View>
                <Text style={{ fontSize: hp(3) }} className="font-medium text-white">Chats</Text>
            </View>
            <View>
                <Menu>
                    <MenuTrigger>
                        <Text className='flex-2'>
                            {/* <Text className="text-white mr-10 mb-4">{user.username}</Text> */}
                            <Image
                                style={{ height: hp(4.3), aspectRatio: 1, borderRadius: 100 }}
                                source={user?.profileUrl}
                                placeholder={blurhash}
                                transition={500}
                            />
                        </Text>
                    </MenuTrigger>
                    <MenuOptions customStyles={{
                        optionsContainer: {
                            borderRadius : 10,
                            borderCurve : 'continuous',
                            marginTop : 40,
                            backgroundColor : 'white',
                            shadowOffset : {width : 0, height : 0},
                            shadowOpacity : 0.2,
                            width : 120
                        }
                    }}>
                        <MenuItem text="Profile"
                            action={handleProfileClick}
                            value={null}
                            icon={<Feather name="user" size={hp(2.5)} color="#737373" />} />
                        <Divider />
                        <MenuItem text="Logout"
                            action={handleLogout}
                            value={null}
                            icon={<AntDesign name="logout" size={hp(2.5)} color="#737373" />} />
                    </MenuOptions>
                </Menu>
            </View>
        </View>
    )
}

const Divider = () => {
    return (
        <View className="p-[1px] w-full bg-neutral-200" />
    )
}