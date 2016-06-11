const response_map = require("../../lib/router/response-map")

describe("response map", () => {

  describe("create", () => {
    it("returns a response map from value", () => {
      const r = response_map.create("hey")
      expect(r).toEqual(jasmine.objectContaining({
        status: 200,
        headers: {},
        body: "hey"
      }))
      expect(r instanceof response_map.ResponseMap).toBe(true)
    })

    it("returns a response map from {}response map", () => {
      const r = response_map.create({
        status: 123,
        headers: { a: 1 }
      })
      expect(r).toEqual(jasmine.objectContaining({
        status: 123,
        headers: { a: 1 },
        body: ""
      }))
      expect(r instanceof response_map.ResponseMap).toBe(true)
    })

    // response.response already checks if it's a ResponseMap
    // but if for some reason it's called with one
    // it just creates a new similar one
    it("returns response map if already response map", () => {
      const t = new response_map.ResponseMap("hi")
      const r = response_map.create(t)
      expect(r instanceof response_map.ResponseMap).toBe(true)
      expect(r).not.toBe(t)
      expect(r).toEqual(jasmine.objectContaining({
        status: 200,
        headers: {},
        body: "hi"
      }))
    })
  })

  describe("is_response_map", () => {
    it("returns true if response map", () => {
      const t = new response_map.ResponseMap()
      const r = response_map.is_response_map(t)
      expect(r).toBe(true)
    })

    it("returns false for {}response map", () => {
      const t = { status: 200, headers: {}, body: "" }
      const r = response_map.is_response_map(t)
      expect(r).toBe(false)
    })
  })

  describe("ResponseMap", () => {
    const ResponseMap = response_map.ResponseMap

    it("initializes with a default response map", () => {
      const r = new ResponseMap()
      expect(r).toEqual(jasmine.objectContaining({
        status: 200,
        headers: {},
        body: ""
      }))
    })

    describe("statusCode", () => {
      it("sets the status code", () => {
        const r = new ResponseMap().statusCode(78)
        expect(r.status).toBe(78)
      })

      it("converts non-number arguments to number", () => {
        const r = new ResponseMap().statusCode("123")
        expect(r.status).toBe(123)
      })
    })

    describe("type", () => {
      it("sets the content type from known types", () => {
        const r = new ResponseMap().type("json")
        expect(r.headers["Content-Type"]).toBe("application/json")
      })

      it("sets the content type to be argument if not known type", () => {
        const r = new ResponseMap().type("json123")
        expect(r.headers["Content-Type"]).toBe("json123")
      })
    })

    describe("safeType", () => {
      it("sets the content type from known types", () => {
        const r = new ResponseMap().safeType("json")
        expect(r.headers["Content-Type"]).toBe("application/json")
      })

      it("sets the content type to be argument if not known type", () => {
        const r = new ResponseMap().safeType("json123")
        expect(r.headers["Content-Type"]).toBe("json123")
      })

      it("will do nothing if content type already exists", () => {
        const r = new ResponseMap().type("abc123")
        expect(r.headers["Content-Type"]).toBe("abc123")
        r.safeType("what")
        expect(r.headers["Content-Type"]).toBe("abc123")
      })
    })

  })
})
