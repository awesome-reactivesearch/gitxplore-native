
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

  itemCardMarkup = (item) => (
    <View style={[S.fullWidth, { paddingHorizontal: 25, paddingVertical: 10 }]}>
      <Card>
        <CardItem>
          <Body style={{ alignItems: "center" }}>
            <Thumbnail
              source={{uri: item.avatar}}
            />
            <Text
              onPress={() => web(item.url)}
              style={{ fontWeight: "bold", color: primaryColor, paddingBottom: 5, paddingTop: 5 }}
              >
                {item.owner}/{item.name}
            </Text>
            <Text style={{ paddingBottom: 15, textAlign: "center" }}>{item.description}</Text>
            <View style={{flexDirection:"row", flexWrap:"wrap", paddingTop: 5, paddingBottom: 9}}>
              {this.renderTopics(item)}
            </View>
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
  )

  onAllData = (items, streamData, loadMore) => (
		<FlatList
			style={{ width: '100%' }}
			data={items || []}
			keyExtractor={item => item._id}
			renderItem={({ item }) => this.itemCardMarkup(item)}
      onEndReachedThreshold={0.5}
      onEndReached={loadMore}
		/>
	);

  onData(item) {
    return this.itemCardMarkup(item);
  }

  renderControls() {
    let { showNav, topics } = this.state;

    return (
      <View style={[styles.controls, showNav ? styles.flex : styles.none]}>
        <Text style={{ color: "white", paddingBottom: 10 }}>Language</Text>
        <View style={{ borderWidth: 1, borderColor: '#8cd9af' }}>
          <SingleDropdownList
            componentId="language"
            dataField="language.raw"
            placeholder="Select"
            size={100}
          />
        </View>
        <View style={{ paddingBottom: 30 }}></View>
        { /*
        <Text style={{ color: "white", paddingBottom: 10 }}>Repo Topics</Text>
        <View>
          <MultiDropdownList
            componentId="topics"
            dataField="topics.raw"
            placeholder="Select"
            defaultSelected={topics}
            size={1000}
            queryFormat="and"
            onValueChange={value => this.resetTopic(value)}
          />
        </View>
        */ }
      </View>
    );

  }

  render() {
    let { statusBarColor, isReady, showNav, topics } = this.state;

    const topBar = (
      <View style={{paddingTop: Expo.Constants.statusBarHeight + 17, backgroundColor: statusBarColor}}></View>
    );

    // const topBar = (
    //   <StatusBar
    //     backgroundColor={primaryColor}
    //     barStyle="light-content"
    //   />
    // )

    const header = (
      // <Header style={{backgroundColor: primaryColor}}>
        // <Body>
          <View style={{alignItems: "center", backgroundColor: primaryColor}} >
            <Image
              style={{height: 27, width: 170}}
              source={{uri: "https://i.imgur.com/2onYRdN.png"}}
            />
          </View>
        // </Body>
      // </Header>
    );

    if (!isReady) {
      return (
        <Container>
          {topBar}
          {header}
          <Content>
            <Spinner color={primaryColor} />
            <Text>Loading ...</Text>
          </Content>
        </Container>
      );
    }

    return (
      <View>
        {topBar}
        <View>
          {header}
          <ScrollView style={{backgroundColor: "white"}}>
            <Container>
              <Content>
                <ReactiveBase
                  app="gitxplore-latest"
                  type="gitxplore-latest"
                  credentials="W7ZomvYgQ:df994896-a25d-4d4e-8724-e26659b93001"
                  >
                    <View style={[S.container, S.column, styles.container]}>
                    <View style={{ backgroundColor: primaryColor, paddingBottom: 20, paddingTop: 20 }}>
                      <Button iconLeft style={{ alignSelf: "center", backgroundColor: "white" }} onPress={this.handleToggleFilters}>
                        <Icon name="md-search" style={{ fontSize: 20, color: primaryColor }}/>
                        <Text style={{ color: primaryColor }}>
                          Toggle Filters
                        </Text>
                      </Button>
                    </View>
                    {this.renderControls()}
                    <View style={[S.fullWidth, S.alignCenter, styles.results]}>
                      <ReactiveList
                        dataField="language"
                        componentId="ReactiveList"
                        size={20}
                        from={0}
                        // onData={(res) => this.onData(res)}
                        onAllData={this.onAllData}
                        pagination
                        react={{
                          and: ["language", "topics"]
                        }}
                        showResultStats={false}
                      />
                    </View>
                  </View>
                </ReactiveBase>
              </Content>
            </Container>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default App;
