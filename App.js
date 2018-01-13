
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

