from fastapi.testclient import TestClient
from main import app
import json

client = TestClient(app)

def test_system():
    # 1. Health check
    res_health = client.get("/api/health")
    assert res_health.status_code == 200, f"Health check failed: {res_health.text}"
    print("Health check passed:", res_health.json())

    # 2. Samples check
    res_samples = client.get("/api/samples")
    assert res_samples.status_code == 200
    samples = res_samples.json()
    print(f"Sample images loaded ({len(samples)} items)")

    # 3. Analyze Normal sample (sample-0)
    res_analyze = client.post("/api/analyze", data={"sample_id": "sample-0", "model_name": "convnext_tiny"})
    assert res_analyze.status_code == 200, f"Analysis failed: {res_analyze.text}"
    data_0 = res_analyze.json()
    print("Sample 0 predicted grade:", data_0["predicted_grade"], data_0["predicted_class"], "Accepted:", data_0["prediction_accepted"])

    # 4. Analyze Poor Quality sample (sample-5) - MUST REJECT!
    res_poor = client.post("/api/analyze", data={"sample_id": "sample-5", "model_name": "convnext_tiny"})
    assert res_poor.status_code == 200
    data_poor = res_poor.json()
    print("Poor quality sample rejected properly:", not data_poor["quality_metrics"]["overall_quality_passed"], "Reason:", data_poor["rejection_reason"])
    assert not data_poor["quality_metrics"]["overall_quality_passed"], "Quality filter should reject poor sample!"

    # 5. Benchmark data check
    res_bench = client.get("/api/benchmark")
    assert res_bench.status_code == 200
    print("Benchmark datasets loaded:", list(res_bench.json().keys()))

    # 6. History check
    res_hist = client.get("/api/history")
    assert res_hist.status_code == 200
    print(f"History records verified ({len(res_hist.json())} items)")

    # 7. PDF Report generation
    res_pdf = client.post("/api/generate-pdf", json=data_0)
    assert res_pdf.status_code == 200
    assert len(res_pdf.content) > 1000
    print(f"PDF Report generated successfully ({len(res_pdf.content)} bytes)")

    print("\nALL BACKEND API TESTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    test_system()
