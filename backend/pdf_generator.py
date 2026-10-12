import io
import base64
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from PIL import Image

def generate_analysis_pdf(analysis_data: dict) -> bytes:
    """
    Generate a reproducible, clinical research audit PDF report for Retinova AI.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=2
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=12
    )
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=10,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#334155')
    )
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#991b1b')
    )

    story = []

    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>RETINOVA AI</b><br/><font size=8 color='#64748b'>See Beyond the Retina</font>", title_style),
            Paragraph(f"<b>CONFIDENTIAL RESEARCH REPORT</b><br/><font size=8 color='#64748b'>Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}</font>", ParagraphStyle('HRight', parent=body_style, alignment=2))
        ]
    ]
    t_header = Table(header_data, colWidths=[3.5 * inch, 3.5 * inch])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_header)
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#6366f1'), spaceAfter=12))

    # 2. Metadata Table
    meta_rows = [
        [
            Paragraph("<b>Analysis ID:</b>", body_style),
            Paragraph(str(analysis_data.get('analysis_id', 'N/A')), body_style),
            Paragraph("<b>Model Architecture:</b>", body_style),
            Paragraph(str(analysis_data.get('model_name', 'ConvNeXt-Tiny')), body_style)
        ],
        [
            Paragraph("<b>Image Hash (SHA-256):</b>", body_style),
            Paragraph(str(analysis_data.get('image_hash', 'N/A'))[:20] + "...", body_style),
            Paragraph("<b>Model Version:</b>", body_style),
            Paragraph(str(analysis_data.get('model_version', 'v1.4.2-retina')), body_style)
        ],
        [
            Paragraph("<b>Inference Latency:</b>", body_style),
            Paragraph(f"{analysis_data.get('processing_time_ms', 0):.1f} ms", body_style),
            Paragraph("<b>Preprocessing Pipeline:</b>", body_style),
            Paragraph("Ben Graham Local Contrast (384x384)", body_style)
        ]
    ]
    t_meta = Table(meta_rows, colWidths=[1.6 * inch, 2.0 * inch, 1.6 * inch, 1.8 * inch])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # 3. Quality Control Audit
    story.append(Paragraph("1. Image Quality Screening Audit", section_heading))
    qm = analysis_data.get('quality_metrics', {})
    quality_passed = qm.get('overall_quality_passed', True)
    q_color = colors.HexColor('#15803d') if quality_passed else colors.HexColor('#b91c1c')
    q_status = "PASSED (Suitable for Neural Inference)" if quality_passed else "FAILED / REJECTED"
    
    q_rows = [
        [
            Paragraph("<b>Automated Quality Status:</b>", body_style),
            Paragraph(f"<font color='{q_color.hexval()}'><b>{q_status}</b></font>", body_style),
            Paragraph("<b>Retinal Mask Validity:</b>", body_style),
            Paragraph("Valid Retinal Field" if qm.get('is_valid_fundus', True) else "Invalid Anatomy", body_style)
        ],
        [
            Paragraph("<b>Sharpness (Laplacian Var):</b>", body_style),
            Paragraph(f"{qm.get('blur_score', 0):.1f} (Threshold >= 50.0)", body_style),
            Paragraph("<b>Illumination / Contrast:</b>", body_style),
            Paragraph(f"Lum: {qm.get('illumination_score', 0):.1f} | Ctr: {qm.get('contrast_score', 0):.1f}", body_style)
        ]
    ]
    if qm.get('rejection_reasons'):
        reasons_text = "; ".join(qm.get('rejection_reasons', []))
        q_rows.append([
            Paragraph("<b>Rejection Reasons:</b>", body_style),
            Paragraph(f"<font color='#b91c1c'>{reasons_text}</font>", body_style),
            Paragraph("", body_style),
            Paragraph("", body_style)
        ])
    t_q = Table(q_rows, colWidths=[1.8 * inch, 2.2 * inch, 1.4 * inch, 1.6 * inch])
    t_q.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_q)
    story.append(Spacer(1, 10))

    # 4. Clinical Diagnostic Prediction & Selective Abstention
    story.append(Paragraph("2. Diabetic Retinopathy Classification & Selective Prediction", section_heading))
    pred_grade = analysis_data.get('predicted_grade', 0)
    pred_class = analysis_data.get('predicted_class', 'No DR')
    accepted = analysis_data.get('prediction_accepted', True)
    acc_text = "ACCEPTED (High Confidence)" if accepted else "REJECTED (Abstained due to Uncertainty)"
    acc_color = colors.HexColor('#15803d') if accepted else colors.HexColor('#c2410c')
    
    pred_rows = [
        [
            Paragraph("<b>Predicted ICDR Grade:</b>", body_style),
            Paragraph(f"<font size=11 color='#4338ca'><b>Grade {pred_grade}: {pred_class}</b></font>", body_style),
            Paragraph("<b>Decision Policy:</b>", body_style),
            Paragraph(f"<font color='{acc_color.hexval()}'><b>{acc_text}</b></font>", body_style)
        ],
        [
            Paragraph("<b>Epistemic Uncertainty:</b>", body_style),
            Paragraph(f"{analysis_data.get('epistemic_uncertainty', 0):.4f} (MC-Dropout)", body_style),
            Paragraph("<b>Predictive Entropy H(p):</b>", body_style),
            Paragraph(f"{analysis_data.get('predictive_entropy', 0):.4f} bits", body_style)
        ]
    ]
    t_pred = Table(pred_rows, colWidths=[1.8 * inch, 2.2 * inch, 1.4 * inch, 1.6 * inch])
    t_pred.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_pred)
    story.append(Spacer(1, 10))

    # 5. Class Probabilities Table
    story.append(Paragraph("3. Posterior Probability Distribution (All 5 ICDR Grades)", section_heading))
    probs = analysis_data.get('class_probabilities', {})
    prob_headers = ["Grade 0: No DR", "Grade 1: Mild", "Grade 2: Moderate", "Grade 3: Severe", "Grade 4: Proliferative"]
    prob_keys = ["No DR", "Mild", "Moderate", "Severe", "Proliferative DR"]
    prob_values = [f"{probs.get(k, 0.0)*100:.1f}%" for k in prob_keys]
    
    t_probs = Table([prob_headers, prob_values], colWidths=[1.4 * inch] * 5)
    t_probs.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#ede9fe')),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#ffffff')),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_probs)
    story.append(Spacer(1, 10))

    # 6. Grad-CAM Salience Visual
    gradcam_b64 = analysis_data.get('gradcam_image_base64')
    if gradcam_b64 and "base64," in gradcam_b64:
        story.append(Paragraph("4. Explainable AI: Grad-CAM Activation Heatmap", section_heading))
        try:
            raw_b64 = gradcam_b64.split("base64,")[1]
            img_bytes = base64.b64decode(raw_b64)
            img_stream = io.BytesIO(img_bytes)
            rl_img = RLImage(img_stream, width=2.4 * inch, height=2.4 * inch)
            
            cam_info = [
                [
                    rl_img,
                    Paragraph(
                        "<b>Explanation Method:</b> Grad-CAM (Target: Final Residual Block)<br/>"
                        "<b>Color Mapping:</b> Turbo/Jet (Red = High Saliency, Blue = Baseline)<br/><br/>"
                        "<i>Notice:</i> Grad-CAM highlights specific morphological receptive fields that disproportionately "
                        "influenced the network's predictive logits (e.g. vascular beading, microaneurysms, macular lipid deposits). "
                        "Activation maps reflect mathematical feature importance and do not equate to causal clinical confirmation.",
                        body_style
                    )
                ]
            ]
            t_cam = Table(cam_info, colWidths=[2.6 * inch, 4.4 * inch])
            t_cam.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
                ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            story.append(t_cam)
        except Exception:
            pass
        story.append(Spacer(1, 12))

    # 7. Regulatory & Experimental Disclaimer Box
    story.append(Spacer(1, 4))
    disclaimer_box = [
        [Paragraph(
            "<b>CRITICAL REGULATORY & CLINICAL SAFETY NOTICE:</b><br/>"
            "Retinova AI is an investigational deep learning research platform developed for methodological exploration "
            "of selective prediction, epistemic uncertainty quantification, and explainable neural representations in ophthalmology. "
            "This software is NOT an FDA/CE-cleared diagnostic medical device. Predictions generated by this system must NEVER be used "
            "as a substitute for dilated fundus examination, optical coherence tomography (OCT), or evaluation by a certified ophthalmologist. "
            "All calibration values and selective rejection thresholds are empirical estimates derived from retrospective research cohorts.",
            disclaimer_style
        )]
    ]
    t_disc = Table(disclaimer_box, colWidths=[7.0 * inch])
    t_disc.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fef2f2')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#f87171')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(t_disc)

    doc.build(story)
    return buffer.getvalue()
