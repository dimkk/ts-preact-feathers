import assert from 'assert';
import { Server } from 'http';
import url from 'url';
import axios from 'axios';

import app from './app';

const port = app.get('port') || 8998;
const getUrl = (pathname?: string) => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});

describe('Feathers application tests', () => {
  let server: Server;

  beforeAll(function(done) {
    server = app.listen(port);
    server.once('listening', () => done());
  });

  afterAll(function(done) {
    server.close(done);
  });

  test('starts and shows the index page', async (done) => {
    const { data } = await axios.get(getUrl());
    expect(data).toMatch('<html lang="en">')
    done()
  });

  describe('404', function() {
    it('shows a 404 HTML page', async (done) => {
      try {
        await axios.get(getUrl('path/to/nowhere'), {
          headers: {
            'Accept': 'text/html'
          }
        });
        assert.fail('should never get here');
      } catch (error) {
        const { response } = error;

        assert.equal(response.status, 404);
        assert.ok(response.data.indexOf('<html>') !== -1);
      } finally {
          done()
      }
    });

    it('shows a 404 JSON error without stack trace', async () => {
      try {
        await axios.get(getUrl('path/to/nowhere'));
        assert.fail('should never get here');
      } catch (error) {
        const { response } = error;

        assert.equal(response.status, 404);
        assert.equal(response.data.code, 404);
        assert.equal(response.data.message, 'Page not found');
        assert.equal(response.data.name, 'NotFound');
      }
    });
  });
});