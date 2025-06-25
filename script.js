document.getElementById('emailForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  console.log("Captured email (dev mode):", email);

  document.getElementById('emailForm').style.display = 'none';
  document.getElementById('mainWidget').style.display = 'block';
});

async function classifyProduct() {
  const description = document.getElementById('product').value;
  const country = document.getElementById('country').value;
  const resultBox = document.getElementById('result');
  const loading = document.getElementById('loading');

  resultBox.innerHTML = '';
  loading.style.display = 'block';

  try {
    const response = await fetch('https://tslite-api.onrender.com/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, country })
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    loading.style.display = 'none';

    resultBox.innerHTML = `
  <strong>Classification Result</strong><br><br>
  <strong>HTS Code:</strong> ${data.hts_code}<br>
  <strong>Duty:</strong> ${data.duty}%<br>
  <strong>VAT:</strong> ${data.vat}%<br>
  <strong>Total Landed Cost:</strong> $${data.total_cost}<br>
  <strong>Confidence:</strong> ${(data.confidence * 100).toFixed(1)}%<br>
  <em>${explainConfidence(data.confidence)}</em><br><br>
  <strong>Rationale:</strong><br>${data.rationale}
`;
  } catch (error) {
    loading.style.display = 'none';
    console.error("API call failed:", error);
    resultBox.innerHTML = '❌ Something went wrong. Please try again.';
  }
}

function explainConfidence(confidence) {
  if (confidence >= 90) return "High confidence – Ready for use.";
  if (confidence >= 70) return "Medium confidence – Review recommended.";
  return "Low confidence – Please double check.";
}
