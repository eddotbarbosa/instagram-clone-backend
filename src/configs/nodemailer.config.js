// i recommend the use of some fake smtp server on development stage

exports.transporter = {
  host: "",
  port: 0,
  auth: {
    user: "",
    pass: ""
  }
};
