import React, { Component } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";
import axios from "axios";
import { Card, CardTitle, CardImage } from "react-native-material-cards";

class GeneralNews extends Component {
  state = {
    news: [],
    refreshing: false,
    loading: true
  };
  componentDidMount() {
    this.fetchNewsFromBackEnd();
  }
  fetchNewsFromBackEnd = () => {
    axios
      .get("https://projectbackendheroku.herokuapp.com/latestNews")
      .then(resp => {
        const newsForApp = resp.data.data.news_list.slice(0, 30);
        this.setState({
          news: newsForApp,
          refreshing: false,
          loading: false
        });
        console.log(newsForApp);
      })
      .catch(err => {
        console.log("[News.js]" + err);
      });
  };
  handleRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.fetchNewsFromBackEnd();
    });
  };
  render() {
    const newsToShow = this.state.loading ? (
      <View style={styles.container}>
        <ActivityIndicator
          color="black"
          size="large"
          style={styles.activityIndicator}
        />
      </View>
    ) : (
      <View>
        <FlatList
          data={this.state.news}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("FullPage", {
                  image: item.news_obj.image_url,
                  title: item.news_obj.title,
                  content: item.news_obj.content,
                  link: item.news_obj.bottom_panel_link,
                  author: item.news_obj.author_name,
                  readmore: true
                })
              }
            >
              <Card>
                <CardImage source={{ uri: item.news_obj.image_url }} />
                <CardTitle title={item.news_obj.title} />
              </Card>
            </TouchableOpacity>
          )}
        />
      </View>
    );
    return <View>{newsToShow}</View>;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 180
  }
});
export default GeneralNews;
