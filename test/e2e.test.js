import server from '../src/server'
import client from '../src/client'
import fetch from 'node-fetch'

describe('detox analytics tracker', () => {
  describe('given that the server is server.started when already running', () => {
    afterEach(() => {
      server.stop()
    })
    it('should throw an error on server.start()', () => {
      expect(() => {
        server.start()
        server.start()
      }).toThrow()
    })
  })
  describe('given that the server is server.stopped when not running', () => {
    beforeEach(() => {
      server.start()
    })
    it('should throw an error on server.stop()', () => {
      expect(() => {
        server.stop()
        server.stop()
      }).toThrow()
    })
  })
  describe('given that a call is made via the client proxy', () => {
    let analytics
    beforeEach(() => {
      analytics = client.getProxy('analytics', 'ios')
      server.start()
    })
    afterEach(() => {
      server.stop()
    })
    it('should be received by the server and made available via server.getEvents', async () => {
      const events = [['login-btn-press', { string: 'hello', boolean: true, number: 5 }]]
      const expectedEvents = events.map(([eventName, params]) => ({ eventName, params }))
      for (const event of events) {
        await analytics.trackEvent(...event)
      }
      const trackedEvents = server.getEvents('analytics.trackEvent')
      expect(trackedEvents).toEqual(expectedEvents)
    })
    it('it should be received by the server and made available via getEventNames', async () => {
      const events = [['login-btn-press', { string: 'hello', boolean: true, number: 5 }]]
      const expectedEventNames = events.map(([eventName]) => eventName)
      for (const event of events) {
        await analytics.trackEvent(...event)
      }
      const trackedEventNames = server.getEventsNames('analytics.trackEvent')
      expect(trackedEventNames).toEqual(expectedEventNames)
    })
    it('should retain the call order of when the events were triggered', async () => {
      const events = [
        ['login-page-open'],
        ['login-btn-press', { string: 'hello', boolean: true, number: 1 }],
        ['logout-btn-press', { string: 'bye', boolean: false, number: 0 }],
        ['login-page-open', {}],
      ]
      const expectedEvents = events.map(([eventName, params]) => ({ eventName, params }))
      const expectedEventNames = events.map(([eventName]) => eventName)
      for (const event of events) {
        await analytics.trackEvent(...event)
      }
      const trackedEvents = server.getEvents('analytics.trackEvent')
      expect(trackedEvents).toEqual(expectedEvents)
      const trackedEventNames = server.getEventsNames('analytics.trackEvent')
      expect(trackedEventNames).toEqual(expectedEventNames)
    })
  })
  describe('given that the server is flushed after receiving analytics events', () => {
    let analytics
    beforeEach(() => {
      analytics = client.getProxy('analytics', 'ios')
      server.start()
    })
    afterEach(() => {
      server.stop()
    })
    it('should clear the results of getEvents and getEventNames', async () => {
      const events = [['login-btn-press', { string: 'hello', boolean: true, number: 5 }]]
      const expectedEvents = events.map(([eventName, params]) => ({ eventName, params }))
      const expectedEventNames = events.map(([eventName]) => eventName)
      for (const event of events) {
        await analytics.trackEvent(...event)
      }
      const trackedEventsBefore = server.getEvents('analytics.trackEvent')
      expect(trackedEventsBefore).toEqual(expectedEvents)
      const trackedEventNamesBefore = server.getEventsNames('analytics.trackEvent')
      expect(trackedEventNamesBefore).toEqual(expectedEventNames)
      server.flush()
      const trackedEventsAfter = server.getEvents('analytics.trackEvent')
      expect(trackedEventsAfter).toEqual([])
      const trackedEventNamesAfter = server.getEventsNames('analytics.trackEvent')
      expect(trackedEventNamesAfter).toEqual([])
    })
  })
})
