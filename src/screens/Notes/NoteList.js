import React, { Component } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, ScrollView, Text } from 'react-native';
import NoteCell from "@Screens/Notes/NoteCell"
import Search from 'react-native-search-box'
import StyleKit from "@Style/StyleKit"
import ApplicationState from "@Lib/ApplicationState"
import ThemedComponent from "@Components/ThemedComponent"

export default class NoteList extends ThemedComponent {

  renderHeader = () => {
    return (
      <View style={{paddingLeft: 5, paddingRight: 5, paddingTop: 5, backgroundColor: StyleKit.variable("stylekitBackgroundColor")}}>
        <Search
          onChangeText={this.props.onSearchChange}
          onCancel={this.props.onSearchCancel}
          onDelete={this.props.onSearchCancel}
          blurOnSubmit={true}
          backgroundColor={StyleKit.variable("stylekitBackgroundColor")}
          titleCancelColor={StyleKit.variable("stylekitInfoColor")}
          keyboardDismissMode={'interactive'}
          keyboardAppearance={StyleKit.get().keyboardColorForActiveTheme()}
          inputBorderRadius={4}
          inputStyle={
            {
              backgroundColor: StyleKit.variables.stylekitContrastBackgroundColor,
              color: StyleKit.variables.stylekitForegroundColor,
              height: 30
            }
          }
        />
      </View>
    );
  };

  // must pass title, text, and tags as props so that it re-renders when either of those change
  _renderItem = ({item}) => {
    // On Android, only one tag is selected at a time. If it is selected, we don't need to display the tags string
    // above the note cell
    let selectedTags = this.props.selectedTags || [];
    let renderTags = ApplicationState.isIOS || selectedTags.length == 0 || (!item.tags.includes(selectedTags[0]));

    return (
      <NoteCell
        item={item}
        onPressItem={this.props.onPressItem}
        title={item.title}
        text={item.text}
        tags={item.tags}
        tagsString={item.tagsString()}
        sortType={this.props.sortType}
        renderTags={renderTags}
        options={this.props.options}
        highlighted={item.uuid == this.props.selectedNoteId}
        handleAction={this.props.handleAction}

        pinned={item.pinned /* extraData */}
        deleted={item.deleted /* extraData */}
        archived={item.archived /* extraData */}
        locked={item.locked /* extraData */}
        protected={item.content.protected /* extraData */}
        hidePreview={item.content.hidePreview /* extraData */}
      />
    )
  }

  render() {
    var placeholderText = "";
    if(this.props.decrypting) {
      placeholderText = "Decrypting notes...";
    } else if(this.props.loading) {
      placeholderText = "Loading notes...";
    } else if(this.props.notes.length == 0) {
      placeholderText = "No notes.";
    }

    return (
      <View style={{backgroundColor: StyleKit.variable("stylekitBackgroundColor")}}>

        {placeholderText.length > 0 &&
          <View style={this.styles.loadingTextContainer}>
            <Text style={this.styles.loadingText}>
              {placeholderText}
            </Text>
          </View>
        }

        <FlatList style={{height: "100%"}}
          initialNumToRender={6}
          windowSize={6}
          maxToRenderPerBatch={6}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={'always'}
          refreshControl={!this.props.hasRefreshControl ? null :
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.props.onRefresh}
            />
          }
          data={this.props.notes}
          options={this.props.options}
          renderItem={this._renderItem}
          ListHeaderComponent={this.renderHeader}
        />

      </View>
    )
  }

  loadStyles() {
    this.styles = StyleSheet.create({
      container: {
        flex: 1,
      },

      loadingTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
        position: "absolute",
        height: "100%",
        width: "100%"
      },

      loadingText: {
        position: "absolute",
        opacity: 0.5,
        color: StyleKit.variables.stylekitForegroundColor
      }
    });
  }
}
