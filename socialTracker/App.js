import React from 'react';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import InitialHomeScreen from './src/screens/InitialHomeScreen';
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import MeetingsScreen from './src/screens/MeetingsScreen';
import MeetingDetailScreen from './src/screens/MeetingDetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import PersonProfileScreen from './src/screens/PersonProfileScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import AddScreen from './src/screens/AddScreen';
import AddMeetingScreen from './src/screens/AddMeetingScreen';
import AddPersonScreen from './src/screens/AddPersonScreen';
import ManageCategoriesScreen from './src/screens/ManageCategoriesScreen';
import AccountScreen from './src/screens/AccountScreen';
import EditPersonProfileScreen from './src/screens/EditPersonProfileScreen';

import {Provider as AuthProvider} from './src/context/AuthContext';
import {Provider as MeetingsProvider} from './src/context/MeetingsContext';
import {Provider as PeopleProvider} from './src/context/PeopleContext';
import {Provider as CategoryProvider} from './src/context/CategoryContext';
import {Provider as ImageProvider} from './src/context/ImageContext';
import {setNavigator} from './src/navigationRef';

import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const Dashboard = createStackNavigator({
  Dashboard: DashboardScreen,
  PersonProfile: PersonProfileScreen,
  Edit: EditPersonProfileScreen,
  MeetingDetail: MeetingDetailScreen
});

Dashboard.navigationOptions = {
  title: 'Dashboard',
  tabBarIcon: <AntDesign name="dashboard" size={20} color="black" />,
  cardStyle: {
    backgroundColor: 'white'
  }
}

const Meetings = createStackNavigator({
  Meetings: MeetingsScreen,
  MeetingDetail: MeetingDetailScreen,
  PersonProfile: PersonProfileScreen,
  Edit: EditPersonProfileScreen
});

Meetings.navigationOptions = {
  title: 'Meetings',
  tabBarIcon: <Feather name="list" size={20} color="black" />,
  cardStyle: {
    backgroundColor: 'white'
  }
}

const Add = createStackNavigator({
  Add: AddScreen,
  AddMeeting: AddMeetingScreen,
  AddPerson: AddPersonScreen,
  ManageCategories: ManageCategoriesScreen,
  Category: CategoryScreen,
  PersonProfile: PersonProfileScreen,
  Edit: EditPersonProfileScreen
});

Add.navigationOptions = {
  title: 'Add',
  tabBarIcon: <AntDesign name="addusergroup" size={20} color="black" />,
  cardStyle: {
    backgroundColor: 'white'
  }
}

const Search = createStackNavigator({
  Search: SearchScreen,
  PersonProfile: PersonProfileScreen,
  Edit: EditPersonProfileScreen,
  MeetingDetail: MeetingDetailScreen,
  Category: CategoryScreen
});

Search.navigationOptions = {
  title: 'Search',
  tabBarIcon: <AntDesign name="search1" size={20} color="black" />
}

const switchNavigator = createSwitchNavigator({
  ResolveAuth: ResolveAuthScreen,
  loginFlow: createStackNavigator({
    InitialHome: InitialHomeScreen,
    Signin: SigninScreen,
    Signup: SignupScreen
  }),
  mainFlow: createBottomTabNavigator({
    Dashboard,
    Meetings,
    Add,
    Search,
    Account: AccountScreen
  
  })
})

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <ImageProvider>
      <CategoryProvider>
        <PeopleProvider>
          <MeetingsProvider>
            <AuthProvider>
              <App ref={(navigator) => setNavigator(navigator)}/>
            </AuthProvider>
          </MeetingsProvider>
        </PeopleProvider>
      </CategoryProvider>
    </ImageProvider>
    
  )
};