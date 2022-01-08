const temperatureConversion = function (typeTo, typeFrom, value) {
  const conversionLookup = {
    celsius: {
      fahrenheit: function (temp) {
        return (5 / 9) * (temp - 32);
      },
      kelvin: function (temp) {
        return temp - 273;
      }
    },
    fahrenheit: {
      celsius: function (temp) {
        return ((9 / 5) * temp) + 32;
      },
      kelvin: function (temp) {
        return ((9 / 5) * (temp - 273)) + 32;
      }
    },
    kelvin: {
      celsius: function (temp) {
        return temp + 273;
      },
      fahrenheit: function (temp) {
        return ((5 / 9) * (temp - 32)) + 273;
      }
    }
  };
  return conversionLookup[typeTo][typeFrom](value);
}

export { temperatureConversion };