const images = {
  authCover: require('./images/auth-cover.png'),
};

// Tab icons — imported as SVG components via react-native-svg-transformer
import HomeIcon from './icons/tabs/home.svg';
import SearchIcon from './icons/tabs/search.svg';
import OperatorsIcon from './icons/tabs/operators.svg';
import ProfileIcon from './icons/tabs/profile.svg';

const tabIcons = { HomeIcon, SearchIcon, OperatorsIcon, ProfileIcon };

export { images, tabIcons };
