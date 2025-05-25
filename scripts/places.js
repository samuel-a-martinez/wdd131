function calculateWindChill(temperatureCelsius, windSpeedKmH) {
    if (temperatureCelsius <= 10 && windSpeedKmH > 4.8) {
        const windChill = 13.12 + (0.6215 * temperatureCelsius) - (11.37 * Math.pow(windSpeedKmH, 0.16)) + (0.3965 * temperatureCelsius * Math.pow(windSpeedKmH, 0.16));
        return windChill.toFixed(1);
    } else {
        return "N/A";
    }
}

const currentYearSpan = document.getElementById('currentyear');
const lastModifiedSpan = document.getElementById('lastmodified');
const temperatureSpan = document.getElementById('temperature');
const windSpeedSpan = document.getElementById('windspeed');
const windChillSpan = document.getElementById('windchill');

document.addEventListener('DOMContentLoaded', function(){
  const lastModifiedParagraph = document.getElementById('lastModified');
  if (lastModifiedParagraph) {
    const lastModifiedDate = document.lastModified;
    lastModifiedParagraph.textContent = `Last Modification: ${lastModifiedDate}`;
  }
});

const temperature = parseFloat(temperatureSpan.textContent);
const windSpeed = parseFloat(windSpeedSpan.textContent);

if (temperature <= 10 && windSpeed > 4.8) {
    const calculatedWindChill = calculateWindChill(temperature, windSpeed);
    windChillSpan.textContent = `${calculatedWindChill}`;
} else {
    windChillSpan.textContent = "N/A";
}