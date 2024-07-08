import unittest
from unittest import mock
from calibrtr import CalibrtrClient

expected_api_key = "AA_BB_CC"

expected_request = {
    "prompt": "foo",
    "context": "bar"
}

expected_response = {
    "response": "baz"
}

mock_request = {}


def mocked_requests_post(*args, **kwargs):
    class MockResponse:
        def __init__(self, status_code):
            self.status_code = status_code

    url = args[0]
    assert url == f"https://calibrtr.com/api/v1/logusage"
    mock_request['headers'] = kwargs.get('headers')
    mock_request['data'] = kwargs.get('json')


    return MockResponse(200)


class TestCalibrtrClient(unittest.TestCase):
    @mock.patch('requests.post', side_effect=mocked_requests_post)
    def test_log_usage(self, mock_post):
        client = CalibrtrClient(expected_api_key)
        client.log_llm_usage("ai_provider",
                             "ai_model",
                             "system",
                             7,
                             9,
                             request=expected_request,
                             response=expected_response)

        self.assertEqual(mock_post.call_count, 1)
        headers = mock_request['headers']
        data = mock_request['data']
        self.assertEqual(headers['x-api-key'], expected_api_key)
        self.assertEqual(data['type'], "llm")
        self.assertEqual(data['aiProvider'], "ai_provider")
        self.assertEqual(data['aiModel'], "ai_model")
        self.assertEqual(data['system'], "system")
        self.assertEqual(data['requestTokens'], 7)
        self.assertEqual(data['responseTokens'], 9)
        self.assertEqual(data['feature'], None)
        self.assertEqual(data['user'], None)
        self.assertEqual(data['request'], expected_request)
        self.assertEqual(data['response'], expected_response)
