$.ajaxPrefilter(function (opts, originalOpts, jqXHR) {
  var headers = originalOpts.headers || {};
  opts.headers = $.extend(headers, {
      "X-Parse-Application-Id": "YJC4zDW3m6juerUr3e5khFWaAwK6LZPuymLsFY4R",
      "X-Parse-REST-API-Key": "N3VZ5lHAmlFywCPzZTLsWohymDVKsiI47JL0c7cc"
  });
});