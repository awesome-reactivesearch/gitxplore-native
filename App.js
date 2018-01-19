/* eslint-disable */
import Expo from 'expo';
import React, { Component } from "react";
import { Image, View, ScrollView, StyleSheet, Platform, Dimensions, StatusBar, FlatList, TouchableOpacity } from "react-native";
import { Body, Header, Text, Title, Container, Content, Button, H3, Card, CardItem, Icon, Thumbnail, Spinner } from "native-base";
import { web } from "react-native-communications";
import {
  ReactiveBase,
  DataSearch,
  SingleDropdownList,
  SingleDropdownRange,
  ReactiveList
} from "@appbaseio/reactivebase-native";

var { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
if (Platform.OS === 'android') {
  deviceHeight = deviceHeight - StatusBar.currentHeight;
}

const APPBASE_CONFIG = {
  app: 'gitxplore-latest',
  type: "gitxplore-latest",
  credentials: "W7ZomvYgQ:df994896-a25d-4d4e-8724-e26659b93001",
}

const COLORS = {
  primary: "#3cb371",
  secondary: "#79d2a1",
  seperator: "#EEEEEE"
};

const commons = {
  padding1: {
    padding: 10
  },
  padding2: {
    padding: 20
  },
  padding3: {
    padding: 30
  },
  padding4: {
    padding: 40
  },
  padding5: {
    padding: 50
  },
}

const S = {
  fullWidth: {
    width: width,
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
    padding: 0
  },
	header: {
    backgroundColor: COLORS.primary
  },
  headerIcon: {
    paddingLeft: 5,
    paddingRight: 10,
    paddingTop: 3,
    color: COLORS.secondary
  },
  headerBody: {
    flex: 1,
    flexDirection: "row"
  },
  headerTitle: {
    color: COLORS.secondary
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
    display: "none"
  },
  flex: {
    display: "flex"
	},
	searchBooksContainer: {
		paddingHorizontal: 20,
		backgroundColor: COLORS.primary,
	}
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      topics: [],
      showNav: false,
      isReady: false,
      statusBarColor: COLORS.primary,
    };
    this.handleToggleFilters = this.handleToggleFilters.bind(this);
    this.toggleTopic = this.toggleTopic.bind(this);
    this.onData = this.onData.bind(this);
    this.resetTopic = this.resetTopic.bind(this);
    this.renderControls = this.renderControls.bind(this);
    this.renderTesterControls = this.renderTesterControls.bind(this);
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      "Roboto": require("native-base/Fonts/Roboto.ttf"),
      "Roboto_medium": require("native-base/Fonts/Roboto_medium.ttf"),
      "Ionicons": require("native-base/Fonts/Ionicons.ttf")
    });

    this.setState({ isReady: true });
  }

  handleToggleFilters() {
    const showNav = !this.state.showNav;
    this.setState({
      showNav
    });
  }

  toggleTopic(topic) {
    const topics = [ ...this.state.topics ];
    const index = topics.indexOf(topic);
    let nextTopics = [];
    if (index === -1) {
      nextTopics = [ ...topics, topic ];
    } else {
      nextTopics = topics.slice(0, index).concat(topics.slice(index + 1));
    }
    this.setState({
      topics: nextTopics
    });
  }

  resetTopic(topics) {
    const nextTopics = topics || [];
    this.setState({
      topics: nextTopics
    });
  }

  renderTopics(data) {
    if (data.topics.length > 0) {
      return data.topics.slice(0, 3).map(topic => <Text style={{ borderRadius: 6, backgroundColor: COLORS.primary, color: "white", marginRight: 7, marginBottom: 5, padding: 5}} key={`${data.name}-${topic}`}>#{topic}</Text>);
    } else {
      return null;
    }
  }

  itemCardMarkup = (item) => (
		<TouchableOpacity onPress={() => web(item.url)}>
			<View style={[S.fullWidth, { paddingHorizontal: 25, paddingVertical: 10 }]}>
				<Card>
					<CardItem>
						<Body style={{ alignItems: "center" }}>
							<Thumbnail
								source={{uri: item.avatar}}
							/>
							<Text
								onPress={() => web(item.url)}
								style={{ fontWeight: "bold", color: COLORS.primary, paddingBottom: 5, paddingTop: 5 }}
								>
									{item.owner}/{item.name}
							</Text>
							<Text style={{ paddingBottom: 15, textAlign: "center" }}>{item.description}</Text>

							<View style={{flexDirection:"row", flexWrap:"wrap", paddingBottom: 5}}>
								<Text style={{ borderRadius: 6, padding: 5, marginRight: 10, backgroundColor: "#eff3f6" }} onPress={() => web(item.url)}>
									<Icon name="md-star" style={{ fontSize: 20, paddingRight: 10 }}/>
									{item.stars}
								</Text>
								<Text style={{ borderRadius: 6, padding: 5, marginRight: 10, backgroundColor: "#eff3f6" }} onPress={() => web(item.url)}>
									<Icon name="md-git-branch" style={{ fontSize: 20 }}/>
									{item.forks}
								</Text>
								<Text style={{ borderRadius: 6, padding: 5, marginRight: 10, backgroundColor: "#eff3f6" }} onPress={() => web(item.url)}>
									<Icon name="md-eye" style={{ fontSize: 20, paddingRight: 10 }}/>
									{item.watchers}
								</Text>
							</View>
						</Body>
					</CardItem>
				</Card>
			</View>
		</TouchableOpacity>
  )

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

  onData(item) {
    return this.itemCardMarkup(item);
	}

	renderControls() {
		let { showNav, topics } = this.state;
		return (
			<View style={[showNav ? styles.flex : styles.none, {height: deviceHeight, backgroundColor: COLORS.primary}]}>
				<ScrollView>

					<View style={styles.controls}>
						<Text style={{ color: "white", paddingBottom: 10 }}>Language</Text>
						<View style={{ borderWidth: 1, borderColor: '#8cd9af' }}>
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
						<Text style={{ color: "white", paddingBottom: 10 }}>Select topics</Text>
						<View style={{ borderWidth: 1, borderColor: '#8cd9af' }}>
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
						<Text style={{ color: "white", paddingBottom: 10 }}>Repo last active</Text>
						<View style={{ borderWidth: 1, borderColor: '#8cd9af' }}>
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
		)
	}

  renderTesterControls() {
    let { showNav, topics } = this.state;

    return (
			<View style={[showNav ? styles.flex : styles.none, {height: deviceHeight, backgroundColor: COLORS.primary}]}>
				<ScrollView>
					<View style={{padding: 50, backgroundColor: "white", borderWidth: 5, borderColor: COLORS.secondary}}>
						<Text>TEST</Text>
					</View>
					<View style={{padding: 50, backgroundColor: "white", borderWidth: 5, borderColor: COLORS.secondary}}>
						<Text>TEST</Text>
					</View>
					<View style={{padding: 50, backgroundColor: "white", borderWidth: 5, borderColor: COLORS.secondary}}>
						<Text>TEST</Text>
					</View>
					<View style={{padding: 50, backgroundColor: "white", borderWidth: 5, borderColor: COLORS.secondary}}>
						<Text>TEST</Text>
					</View>
					<View style={{padding: 50, backgroundColor: "white", borderWidth: 5, borderColor: COLORS.secondary}}>
						<Text>TEST</Text>
					</View>
					<View style={{padding: 50, backgroundColor: "white", borderWidth: 5, borderColor: COLORS.secondary}}>
						<Text>TEST</Text>
					</View>
					<View style={{padding: 50, backgroundColor: "white", borderWidth: 5, borderColor: COLORS.secondary}}>
						<Text>TEST</Text>
					</View>
					<View style={{padding: 50, backgroundColor: "white", borderWidth: 5, borderColor: COLORS.secondary}}>
						<Text>TEST</Text>
					</View>
				</ScrollView>
			</View>
    );

	}

	  renderTopBarSpacer() {
    // Fix status bar top space in Expo
    if (typeof Expo !== "undefined" && Platform.OS === "android") {
      return (
        <View
          style={{
            paddingTop: StatusBar.currentHeight,
            backgroundColor: COLORS.primary
          }}
        />
      )
    }

    return null;
  }

  render() {
    let { statusBarColor, isReady, showNav, topics } = this.state;

    if (!isReady) {
      return (
        <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
          {this.renderTopBarSpacer()}
          <Spinner color={COLORS.primary} />
        </View>
      );
    }

    const header = (
			<View style={{alignItems: "center", backgroundColor: COLORS.primary, padding: 15}} >
				<Image
					style={{height: 27, width: 170}}
					source={{uri: "https://i.imgur.com/2onYRdN.png"}}
				/>
			</View>
    );

    const SearchComponent = (
      <View style={styles.searchBooksContainer}>
				<View style={{ backgroundColor: COLORS.secondary }}>
					<TouchableOpacity>
						<DataSearch
							componentId="repo"
							dataField={[
								"name",
								"description",
								"name",
								"fullname",
								"owner",
								"topics",
							]}
							// debounce={300}
							autosuggest={false}
							placeholder="🔍  Search Repos"
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
        {this.renderTopBarSpacer()}
        {header}
				{SearchComponent}
				<View style={{ backgroundColor: COLORS.primary, paddingBottom: 20, paddingTop: 20 }}>
					<TouchableOpacity onPress={this.handleToggleFilters} style={{
						padding:10,
						borderRadius:7,
						flex: 0,
						width: 135,
						alignSelf: "center",
						backgroundColor: "white",
						}}>
							<Text style={{ color: COLORS.primary, alignSelf: "center", textAlign: "center" }}>
								Toggle Filters
							</Text>

					</TouchableOpacity>
				</View>
				{this.renderControls()}
        <ScrollView>
          <View style={[styles.container, styles.column]}>
            <View
              style={[styles.fullWidth, styles.alignCenter]}
            >
              <ReactiveList
                componentId="ReactiveList"
                dataField="language"
                size={5}
                onAllData={this.onAllData}
                pagination
                paginationAt="bottom"
                react={{
									and: ["language", "topics", "pushed", "repo"]
								}}
								showResultStats={false}
								defaultQuery={() => ({
									query: {
										match_all: {},
									}
								})}
              />
            </View>
          </View>
        </ScrollView>
      </ReactiveBase>
    );
  }
}

export default App;
