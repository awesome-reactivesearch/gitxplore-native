
import React, { Component } from "react";
import { Image, View, ScrollView, StyleSheet, Platform, Dimensions, StatusBar, FlatList } from "react-native";
import { Body, Header, Text, Title, Container, Content, Button, H3, Card, CardItem, Icon, Thumbnail, Spinner } from "native-base";
import { web } from "react-native-communications";
import {
  ReactiveBase,
  MultiDropdownList,
  SingleDropdownList,
  ReactiveList
} from "@appbaseio/reactivebase-native";

var { height, width } = Dimensions.get('window');
if (Platform.OS === 'android') {
  height = height - StatusBar.currentHeight;
}

const primaryColor = "#3cb371";

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
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  controls: {
    ...commons.padding2,
    paddingTop: 0,
    backgroundColor: primaryColor,
    alignItems: "stretch",
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
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      topics: [],
      showNav: false,
      isReady: false,
      statusBarColor: primaryColor,
    };
    this.handleToggleFilters = this.handleToggleFilters.bind(this);
    this.toggleTopic = this.toggleTopic.bind(this);
    this.onData = this.onData.bind(this);
    this.resetTopic = this.resetTopic.bind(this);
    this.renderControls = this.renderControls.bind(this);
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
      return data.topics.slice(0, 3).map(topic => <Text style={{ borderRadius: 6, backgroundColor: primaryColor, color: "white", marginRight: 7, marginBottom: 5, padding: 5}} key={`${data.name}-${topic}`}>#{topic}</Text>);
    } else {
      return null;
    }
  }

  onAllData = (items, streamData, loadMore) => (
		<FlatList
			style={{ width: '100%' }}
			data={items || []}
			keyExtractor={item => item._id}
			renderItem={({ item }) => (
				<View style={{ margin: 5 }}>
					<Text
						style={{ flex: 1, fontWeight: 'bold' }}
					>
						{item.name}
					</Text>
					<Text>{item.name} - {item.stars}</Text>
				</View>
			)}
      onEndReachedThreshold={0.5}
      onEndReached={loadMore}
		/>
	);

  onData(data) {
    return (
      <View style={[S.fullWidth]}>
        <Card>
          <CardItem>
            <Body style={{ alignItems: "center" }}>
              <Thumbnail
                source={{uri: data.avatar}}
              />
              <Text
                onPress={() => web(data.url)}
                style={{ fontWeight: "bold", color: primaryColor, paddingBottom: 5, paddingTop: 5 }}
                >
                  {data.owner}/{data.name}
                </Text>
                <Text style={{ paddingBottom: 15, textAlign: "center" }}>{data.description}</Text>
                <View style={{flexDirection:"row", flexWrap:"wrap", paddingTop: 5, paddingBottom: 9}}>
                  {this.renderTopics(data)}
                </View>
                <View style={{flexDirection:"row", flexWrap:"wrap", paddingBottom: 5}}>
                  <Text style={{ borderRadius: 6, padding: 5, marginRight: 10, backgroundColor: "#eff3f6" }} onPress={() => web(data.url)}>
                    <Icon name="md-star" style={{ fontSize: 20, paddingRight: 10 }}/>
                    {data.stars}
                  </Text>
                  <Text style={{ borderRadius: 6, padding: 5, marginRight: 10, backgroundColor: "#eff3f6" }} onPress={() => web(data.url)}>
                    <Icon name="md-git-branch" style={{ fontSize: 20 }}/>
                    {data.forks}
                  </Text>
                  <Text style={{ borderRadius: 6, padding: 5, marginRight: 10, backgroundColor: "#eff3f6" }} onPress={() => web(data.url)}>
                    <Icon name="md-eye" style={{ fontSize: 20, paddingRight: 10 }}/>
                    {data.watchers}
                  </Text>
                </View>
              </Body>
            </CardItem>
          </Card>
        </View>
      );
    }

}

export default App;
