<?php
    // 유저로부터 메세지를 받습니다.
    $json_string = file_get_contents('php://input');
    $jsonObj = json_decode($json_string);

    $type = $jsonObj->{"events"}[0]->{"message"}->{"type"};
    // 메세지 취득
    $text = trim($jsonObj->{"events"}[0]->{"message"}->{"text"});
    // ReplyToken취득
    $replyToken = $jsonObj->{"events"}[0]->{"replyToken"};
    //UserID
    $userId = $jsonObj->{"events"}[0]->{"source"}->{"userId"};

    // 텍스트 메세지 이외는 처리를 하지 않습니다.
    if($type != "text"){
        exit;
    }

    $apiUrl = "https://api.line.me/v2/bot/message/reply";
    $accessToken = "FU6GpVLv/B63ArKyEDdablf4AE0d66SmCH2cDZW/7OpSRO3Gk82vUSi9VD1NlFeFnyGdllzFzEokluySdGRgjGAoR+oJ27ynxu4b0uIT3OAUkbOo/GvyKmOYcz0Vou1evA5XUw9f/ebiarul2Gb73gdB04t89/1O/w1cDnyilFU=";
    $messages = array(
        'type' => 'text',
        'text' => '알수없는 명령어 입니다.'
    );

    if (!empty($text)) {

        if ($text == "하이" || $text == "안녕") {
            $snedMessage = "안녕하세요. AkibaTV입니다.";

        } else if ($text == "도움말") {
            $snedMessage = "도움말 입니다.\n";
            $snedMessage .= "현재 사용가능한 명령어는\n";
            $snedMessage .= "하이, 안녕, 도움말이 있습니다.\n";

        } else {
            $snedMessage = "등록 되어있지 않은 명령어 입니다.";
        }

        $messages['text'] = $snedMessage;
    }

    if(!empty($messages)) {
        $post_data = [
            "replyToken" => $replyToken,
            "messages" => [$messages]
        ];

        $ch = curl_init($apiUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post_data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json; charser=UTF-8',
            'Authorization: Bearer ' . $accessToken
        ));
        $result = curl_exec($ch);
        curl_close($ch);
    }
?>