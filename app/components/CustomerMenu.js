import { Text, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export const MenuItem = ({ text, action, value, icon }) => {
    return (
        <MenuOption onSelect={() => action(value)}>
            <View className="px-2 py-1 flex-row gap-3 items-center" style={{height: hp(5)}}>
                {icon}
                <Text style={{ fontSize: hp(1.7) }} className="font-semibold text-neutral-800">{text}</Text>
            </View>
        </MenuOption>
    )
}