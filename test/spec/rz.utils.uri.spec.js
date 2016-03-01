/**
 * Created by Anderson on 26/02/2016.
 */
describe("rz.utils.uri tests", function() {

    it("returns the search string from a complete url", function() {
        expect(rz.utils.uri.getSearch("http://www.norberto.net.br?page=1&section=section1")).toEqual("?page=1&section=section1");
    });

    it("returns the search string from a search string", function () {
        expect(rz.utils.uri.getSearch("?page=1&section=section1")).toEqual("?page=1&section=section1");
    });

    it("returns a void string when url has not seach section", function () {
        expect(rz.utils.uri.getSearch("http://www.norberto.net.br")).toEqual("");
    });

    it("returns param count from a complete url", function () {
        expect(rz.utils.uri.getParamCount("http://www.norberto.net.br?page=1&section=section1")).toEqual(2);
    });

    it("returns param count from a search string", function () {
        expect(rz.utils.uri.getParamCount("?page=1&section=section1")).toEqual(2);
    });

    it("returns zero for url without params", function () {
        expect(rz.utils.uri.getParamCount("http://www.norberto.net.br")).toEqual(0);
    });

    it("returns params list", function () {
        expect(rz.utils.uri.getParamList ("http://www.norberto.net.br?page=1&section=section1").join()).toEqual("page,section");
    });

    it("returns params list from search", function () {
        expect(rz.utils.uri.getParamList ("?page=1&section=section1").join()).toEqual("page,section");
    });

    it("returns empty params list from url without params", function () {
        expect(rz.utils.uri.getParamList ("http://www.norberto.net.br").join()).toEqual("");
    });

    it("returns true for a existent param in url", function () {
        expect(rz.utils.uri.hasParam ("http://www.norberto.net.br?page=1&section=section1","section")).toEqual(true);
    });

    it("returns true for a existent param in search", function () {
        expect(rz.utils.uri.hasParam("?page=1&section=section1","page")).toEqual(true);
    });

    it("returns false for a nonexistent param in url", function () {
        expect(rz.utils.uri.hasParam ("http://www.norberto.net.br?page=1&section=section1","sectionX")).toEqual(false);
    });

    it("returns false for a nonexistent param in search", function () {
        expect(rz.utils.uri.hasParam("?page=1&section=section1","pageX")).toEqual(false);
    });

    it("returns false for a nonexistent param in a url without params", function () {
        expect(rz.utils.uri.hasParam("http://www.norberto.net.br","p")).toEqual(false);
    });

    it("returns a value for a param in url", function () {
        expect(rz.utils.uri.getParamValue("http://www.norberto.net.br?page=1&section=section1","page")).toEqual("1");
    });

    it("returns a value for a param in search", function () {
        expect(rz.utils.uri.getParamValue("?page=1&section=section1","section")).toEqual("section1");
    });

    it("returns UNDEFINED for a nonexistent param in url", function () {
        expect(rz.utils.uri.getParamValue("http://www.norberto.net.br?page=1&section=section1","group")).toEqual(undefined);
    });
    it("returns UNDEFINED for a nonexistent param in search", function () {
        expect(rz.utils.uri.getParamValue("?page=1&section=section1","group")).toEqual(undefined);
    });

    it("returns UNDEFINED for a nonexistent param in url without params", function () {
        expect(rz.utils.uri.getParamValue("http://www.norberto.net.br","group")).toEqual(undefined);
    });
    it("merge a param into url without params", function () {
        expect(rz.utils.uri.mergeParam("http://www.norberto.net.br","group","g1")).toEqual("http://www.norberto.net.br?group=g1");
    });
    it("merge a param into url without params", function () {
        expect(rz.utils.uri.mergeParam("http://www.norberto.net.br","group","g1")).toEqual("http://www.norberto.net.br?group=g1");
    });
    it("merge a param into url with params", function () {
        expect(rz.utils.uri.mergeParam("http://www.norberto.net.br?group=g1","section","s1")).toEqual("http://www.norberto.net.br?group=g1&section=s1");
    });
});