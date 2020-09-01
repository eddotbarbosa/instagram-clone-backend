// i recommend the use of some fake smtp server on development stage

exports.transporter = {
  host: "",
  port: 2525,
  auth: {
    user: "",
    pass: ""
  }
}
