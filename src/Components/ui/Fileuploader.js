import React, { Component } from "react";
import { firebase } from "../../firebase";
import FileUploader from "react-firebase-file-uploader";
import CircularProgress from "@material-ui/core/CircularProgress";

export default class Fileuploader extends Component {
  state = {
    isUploading: false,
    name: "",
    fileURL: ""
  };

  static getDerivedStateFromProps(props, state) {
    if (props.defaultImg) {
      return (state = {
        name: props.defaultImgName,
        fileURL: props.defaultImg
      });
    }
    return null;
  }
  uploadAgain() {
    this.setState({
      isUploading: false,
      name: "",
      fileURL: ""
    });
    this.props.resetImage();
  }
  handleUploadStart() {
    this.setState({
      isUploading: true
    });
  }
  handleUploadError() {
    this.setState({
      isUploading: false
    });
  }
  handleUploadSuccess(filename) {
    this.setState({
      name: filename,
      isUploading: false
    });

    firebase
      .storage()
      .ref(this.props.dir)
      .child(filename)
      .getDownloadURL()
      .then(url =>
        this.setState({
          fileURL: url
        })
      );
    this.props.fileName(filename);
  }
  render() {
    return (
      <div>
        {!this.state.fileURL ? (
          <div>
            <div className="label_inputs">{this.props.tag}</div>
            <FileUploader
              accept="image/*"
              name="image"
              randomizeFilename
              storageRef={firebase.storage().ref(this.props.dir)}
              onUploadStart={() => this.handleUploadStart()}
              onUploadError={() => this.handleUploadError()}
              onUploadSuccess={filename => this.handleUploadSuccess(filename)}
            />
          </div>
        ) : null}

        {this.state.isUploading ? (
          <div
            className="progress"
            style={{ textAlign: "center", margin: "30px 0" }}
          >
            <CircularProgress style={{ color: "#98c6e9" }} thickness={7} />
          </div>
        ) : null}
        {this.state.fileURL ? (
          <div className="image_upload_container">
            <img
              src={this.state.fileURL}
              style={{ width: "50%", height: "50%" }}
              alt={this.state.name}
            />
            <div className="remove" onClick={() => this.uploadAgain()}>
              Remove
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
