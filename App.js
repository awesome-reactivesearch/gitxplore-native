import Expo from 'expo';
import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  H3,
  Header,
  Picker,
  Spinner,
  Text,
  Thumbnail,
  Title,
} from 'native-base';
import { web } from 'react-native-communications';
import {
  DataSearch,
  ReactiveBase,
  ReactiveList,
  SingleDropdownList,
  SingleDropdownRange,
} from '@appbaseio/reactivebase-native';

import { Ionicons as Icon, MaterialCommunityIcons } from '@expo/vector-icons';

var { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
if (Platform.OS === 'android') {
  deviceHeight = deviceHeight - StatusBar.currentHeight;
}

const APPBASE_CONFIG = {
  app: 'gitxplore-latest',
  type: 'gitxplore-latest',
  credentials: 'W7ZomvYgQ:df994896-a25d-4d4e-8724-e26659b93001',
};

const COLORS = {
  primary: 'white',
  secondary: '#f8f8f8',
  resultslist: 'white',
  seperator: '#EEEEEE',
  blue: '#007AFF',
  lightblue: '#cce5ff',
  cardtitle: '#404040',
  carddesc: '#737373',
  bluecard: '#739ffc',
};

const commons = {
  padding1: {
    padding: 10,
  },
  padding2: {
    padding: 20,
  },
  padding3: {
    padding: 30,
  },
  padding4: {
    padding: 40,
  },
  padding5: {
    padding: 50,
  },
};

const S = {
  fullWidth: {
    width: deviceWidth,
  },
  container: {
    flex: 1,
  },
  column: {
    flexDirection: 'column',
  },
  alignCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  header: {
    backgroundColor: COLORS.secondary,
  },
  headerIcon: {
    paddingLeft: 5,
    paddingRight: 10,
    paddingTop: 3,
    color: COLORS.secondary,
  },
  headerBody: {
    flex: 1,
    flexDirection: 'row',
  },
  headerTitle: {
    color: COLORS.secondary,
  },
  controls: {
    ...commons.padding2,
    paddingTop: 0,
    // alignItems: "stretch",
  },
  results: {
    ...commons.padding2,
  },
  none: {
    display: 'none',
  },
  flex: {
    display: 'flex',
  },
  searchBooksContainer: {
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
  },
});

class App extends Component {
  state = {
    topics: [],
    showNav: false,
    isReady: false,
    statusBarColor: COLORS.secondary,
    sortBy: 'bestMatch',
  };

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      Ionicons: require('native-base/Fonts/Ionicons.ttf'),
    });

    this.setState({ isReady: true });
  }

  onValueChange = value => {
    this.setState({
      sortBy: value,
    });
  };

  handleToggleFilters = () => {
    const showNav = !this.state.showNav;
    this.setState({
      showNav,
    });
  };

  itemCardMarkup = item => (
    <TouchableOpacity onPress={() => web(item.url)} style={{ width: '100%' }}>
      <View
        style={{
          paddingHorizontal: 4,
          paddingVertical: 10,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Card style={{ overflow: 'hidden' }}>
          <CardItem style={{ overflow: 'hidden' }}>
            <Body
              style={{
                alignItems: 'center',
                flex: 1,
                overflow: 'hidden',
                // backgroundColor: 'lightgrey',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  flex: 1,
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <Thumbnail source={{ uri: item.avatar }} />
                <View style={{ flexDirection: 'column', flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: COLORS.cardtitle,
                      paddingTop: 8,
                      justifyContent: 'flex-start',
                      paddingLeft: 10,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: COLORS.carddesc,
                      justifyContent: 'flex-start',
                      paddingLeft: 10,
                    }}
                  >
                    @{item.owner}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  paddingBottom: 15,
                  textAlign: 'left',
                  color: COLORS.carddesc,
                  paddingVertical: 25,
                }}
              >
                {item.description}
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  width: '100%',
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingBottom: 5,
                  }}
                >
                  <Icon
                    name="md-git-branch"
                    style={{ fontSize: 20, paddingRight: 3, color: COLORS.bluecard }}
                  />
                  <Text style={{ fontSize: 15, color: COLORS.carddesc }}>
                    {this.kFormatter(item.forks)}
                  </Text>
                  <Icon
                    name="md-eye"
                    style={{
                      fontSize: 20,
                      paddingLeft: 15,
                      paddingRight: 3,
                      color: COLORS.bluecard,
                    }}
                  />
                  <Text style={{ fontSize: 15, color: COLORS.carddesc }}>
                    {this.kFormatter(item.watchers)}
                  </Text>
                </View>
                <View>
                  <Button
                    style={{
                      padding: 5,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: COLORS.bluecard,
                      marginBottom: 5,
                    }}
                    onPress={() => web(item.url)}
                  >
                    <Text>View</Text>
                  </Button>
                </View>
              </View>
            </Body>
            <View
              style={{
                position: 'absolute',
                top: -30,
                right: -30,
                backgroundColor: '#fee7e9',
                height: 60,
                width: 60,
                borderRadius: 30,
                zIndex: 98,
              }}
            />
          </CardItem>
          <Icon
            name="md-star"
            style={{
              position: 'absolute',
              fontSize: 15,
              backgroundColor: '#fee7e9',
              color: '#fa9ea8',
              top: 5,
              right: 5,
            }}
          />
          <Text
            style={{
              position: 'absolute',
              top: 5,
              right: 35,
              color: COLORS.carddesc,
            }}
          >
            {this.kFormatter(item.stars)}
          </Text>
        </Card>
      </View>
    </TouchableOpacity>
  );

  kFormatter = num => (num > 100 ? (num / 1000).toFixed(1) + 'k' : num);

  onAllData = (items, streamData, loadMore) => (
    <FlatList
      style={{ width: '100%' }}
      data={items || []}
      keyExtractor={item => item._id}
      renderItem={({ item }) => this.itemCardMarkup(item)}
      // onEndReachedThreshold={0.5}
      // onEndReached={loadMore}
    />
  );

  onData = item => {
    return this.itemCardMarkup(item);
  };

  renderControls = () => {
    let { showNav, topics } = this.state;
    return (
      <View
        style={[
          showNav ? styles.flex : styles.none,
          {
            height: deviceHeight,
            backgroundColor: COLORS.primary,
            paddingTop: 25,
          },
        ]}
      >
        <ScrollView>
          <View style={styles.controls}>
            <Text style={{ color: COLORS.blue, paddingBottom: 8, paddingTop: 2 }}>Language</Text>
            <View style={{ borderWidth: 1, borderColor: COLORS.lightblue }}>
              <SingleDropdownList
                title="Language"
                componentId="language"
                dataField="language.raw"
                placeholder="Select"
                defaultSelected="JavaScript"
                size={30}
              />
            </View>
          </View>

          <View style={styles.controls}>
            <Text style={{ color: COLORS.blue, paddingBottom: 8, paddingTop: 2 }}>Select topics</Text>
            <View style={{ borderWidth: 1, borderColor: COLORS.lightblue }}>
              <SingleDropdownList
                title="Language"
                componentId="topics"
                dataField="topics"
                placeholder="Select topics"
                defaultSelected="react"
                size={30}
              />
            </View>
          </View>

          <View style={styles.controls}>
            <Text style={{ color: COLORS.blue, paddingBottom: 8, paddingTop: 2 }}>Repo last active</Text>
            <View style={{ borderWidth: 1, borderColor: COLORS.lightblue }}>
              <SingleDropdownRange
                title="Repo last active"
                componentId="pushed"
                dataField="pushed"
                placeholder="Repo last active"
                filterLabel="Last Active"
                data={[
                  { start: 'now-1M', end: 'now', label: 'Last 30 days' },
                  { start: 'now-6M', end: 'now', label: 'Last 6 months' },
                  { start: 'now-1y', end: 'now', label: 'Last year' },
                ]}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  renderStatusBar = () => <StatusBar backgroundColor={COLORS.secondary} barStyle="dark-content" />;

  render = () => {
    const iOS = Platform.OS === 'ios';

    let { statusBarColor, isReady, showNav, topics } = this.state;

    if (!isReady) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {this.renderStatusBar()}
          <Spinner color={COLORS.primary} />
        </View>
      );
    }

    const header = (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.secondary,
          padding: 20,
          paddingTop: iOS ? 30 : 20,
          borderBottomColor: COLORS.seperator,
          borderBottomWidth: 0.5,
        }}
      >
        <View style={{ backgroundColor: '#F8F8F8', width: deviceWidth - 75 }}>
          <DataSearch
            componentId="repo"
            dataField={['name', 'description', 'name', 'fullname', 'owner', 'topics']}
            // debounce={300}
            autosuggest={false}
            placeholder="🔍  Search Repos"
          />
        </View>
        <View>
          <TouchableOpacity onPress={this.handleToggleFilters}>
            <MaterialCommunityIcons
              name={`${showNav ? 'filter' : 'filter-outline'}`}
              style={{ fontSize: 28, color: COLORS.blue, paddingLeft: 12 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
      <ReactiveBase
        app={APPBASE_CONFIG.app}
        credentials={APPBASE_CONFIG.credentials}
        type={APPBASE_CONFIG.type}
      >
        <Container>
          {this.renderStatusBar()}
          {header}
          {this.renderControls()}
          <ScrollView>
            <View style={[styles.container, styles.column]}>
              <View
                style={{
                  alignSelf: 'flex-end',
                  paddingTop: 10,
                  paddingRight: 15,
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    padding: 15,
                    backgroundColor: COLORS.bluecard,
                  }}
                >
                  <Text style={{ color: 'white' }}>Sort by</Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.lightblue,
                    // backgroundColor: '#e6f2ff',
                    width: 150,
                  }}
                >
                  <Picker
                    iosHeader="Sort by"
                    mode="dropdown"
                    placeholder="Sort by"
                    selectedValue={this.state.sortBy}
                    onValueChange={this.onValueChange}
                  >
                    <Picker.Item label="Best Match" value="bestMatch" key="bestMatch" />
                    <Picker.Item label="Most Stars" value="mostStars" key="mostStars" />
                    {/*
                    <Picker.Item label="Fewest Stars" value="fewestStars" key="fewestStars" />
                    */}
                    <Picker.Item label="Most Forks" value="mostForks" key="mostForks" />
                    <Picker.Item
                      label="Recently Updated"
                      value="recentlyUpdated"
                      key="recentlyUpdated"
                    />
                    {/*
                    <Picker.Item label="A to Z" value="atoz" key="atoz" />
                    <Picker.Item label="Z to A" value="ztoa" key="ztoa" />
                    */}
                  </Picker>
                </View>
              </View>
              <View
                style={[
                  styles.fullWidth,
                  styles.alignCenter,
                  {
                    backgroundColor: COLORS.resultslist,
                    paddingHorizontal: 5,
                    marginHorizontal: 5,
                    paddingTop: 5,
                  },
                ]}
              >
                <ReactiveList
                  componentId="ReactiveList"
                  dataField="language"
                  size={5}
                  onAllData={this.onAllData}
                  pagination
                  paginationAt="bottom"
                  react={{
                    and: ['language', 'topics', 'pushed', 'repo'],
                  }}
                  showResultStats={false}
                  defaultQuery={() => {
                    let { sortBy } = this.state;

                    let query = {
                      query: {
                        match_all: {},
                      },
                    };
                    
                    if (sortBy === 'mostStars') {
                      query = {
                        query: {
                          match_all: {},
                        },
                        sort: [
                          {
                            stars: {
                              order: 'desc',
                            },
                          },
                        ],
                      };
                    } else if (sortBy === 'fewestStars') {
                      query = {
                        query: {
                          match_all: {},
                        },
                        sort: [
                          {
                            stars: {
                              order: 'asc',
                            },
                          },
                        ],
                      };
                    } else if (sortBy === 'mostForks') {
                      query = {
                        query: {
                          match_all: {},
                        },
                        sort: [
                          {
                            forks: {
                              order: 'desc',
                            },
                          },
                        ],
                      };
                    } else if (sortBy === 'recentlyUpdated') {
                      query = {
                        query: {
                          match_all: {},
                        },
                        sort: [
                          {
                            pushed: {
                              order: 'desc',
                            },
                          },
                        ],
                      };
                    } else if (sortBy === 'atoz') {
                      query = {
                        query: {
                          match_all: {},
                        },
                        sort: [
                          {
                            name: {
                              order: 'asc',
                            },
                          },
                        ],
                      };
                    } else if (sortBy === 'ztoa') {
                      query = {
                        query: {
                          match_all: {},
                        },
                        sort: [
                          {
                            name: {
                              order: 'desc',
                            },
                          },
                        ],
                      };
                    }

                    return query;
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </Container>
      </ReactiveBase>
    );
  };
}

export default App;
