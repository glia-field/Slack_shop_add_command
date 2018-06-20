//Project properties
//SLACK_INCOMMING_URL: your slack incomming webhook's url

function doPost(e) {
  //<商品名> <価格> <在庫数> <image url> <option_master>
  var input = (e.parameter.text).split(" ");
  var reply_text = "";
  if (input.length == 4) {
    sendMsgWithButton(input[0], input[1], input[2], input[3], e.parameter.user_id, e.parameter.user_name);
    reply_text = "商品の追加に成功いたしました"
  } else if ((input.length == 5) && (input[4] == "master")) {
    sendMsgWithButton(input[0], input[1], input[2], input[3], "master", "master");
    reply_text = "商品の追加に成功いたしました(master mode)"
  } else {
    reply_text = "何らかのエラーが発生しました"
  }
  var res = {
    "text": reply_text
  };
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}

function sendMsgWithButton(product_name, price, num, url, user_id, user_name) {
  // slack channel url (where to send the message)
  var slackUrl = PropertiesService.getScriptProperties().getProperty('SLACK_INCOMMING_URL');
  // message text  
  var messageData = {
    "attachments": [{
      "title": product_name,
      "fields": [{
          "title": "在庫数",
          "value": num,
          "short": true
        },{
          "title": "出品者",
          "value": user_name,
          "short": true
        }
      ],
      "fallback": "Sorry, no support for buttons.",
      "callback_id": "ButtonResponse",
      "color": "#3AA3E3",
      "attachment_type": "default",
      "actions": [{
          "name": "buy",
          "text": price + "円",
          "type": "button",
          "value": price + "," + user_id
        },{
          "name": "cancel",
          "text": "キャンセル",
          "type": "button",
          "value": price + "."+user_id
        }
      ],
      "image_url": url
    }]
  }
  // format for Slack
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    // Convert the JavaScript object to a JSON string.
    'payload': JSON.stringify(messageData)
  };
  // post to Slack
  UrlFetchApp.fetch(slackUrl, options);
}

//デバッグ用
function doPostTest(){
  var e = {
    parameter: {
      text: "Beer 100 http://beer.jpg",
      user_id: "master_id",
      user_name: "master_name"
    }
  }
  
  doPost(e);
}