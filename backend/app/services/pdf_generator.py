"""
Servis za generisanje PDF izvještaja
"""
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from io import BytesIO
from datetime import datetime
from typing import List, Dict


class PDFGenerator:
    """Klasa za generisanje PDF izvještaja o kreditu"""
    
    @staticmethod
    def generate_credit_report(
        credit_data: Dict,
        schedule: List[Dict],
        summary: Dict
    ) -> BytesIO:
        """
        Generiše PDF izvještaj sa otplatnim planom
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, 
                                rightMargin=30, leftMargin=30,
                                topMargin=30, bottomMargin=18)
        
        # Elementi dokumenta
        elements = []
        styles = getSampleStyleSheet()
        
        # Stil za naslov
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1f2937'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        # Naslov
        title = Paragraph("Izvještaj o Kreditu", title_style)
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Osnovni podaci o kreditu
        info_style = ParagraphStyle(
            'InfoStyle',
            parent=styles['Normal'],
            fontSize=12,
            spaceAfter=6
        )
        
        elements.append(Paragraph(f"<b>Datum izvještaja:</b> {datetime.now().strftime('%d.%m.%Y')}", info_style))
        elements.append(Paragraph(f"<b>Iznos kredita:</b> {credit_data.get('amount', 0):,.2f} KM", info_style))
        elements.append(Paragraph(f"<b>Kamatna stopa:</b> {credit_data.get('annual_interest_rate', 0):.2f}%", info_style))
        elements.append(Paragraph(f"<b>Rok otplate:</b> {credit_data.get('term_months', 0)} mjeseci", info_style))
        elements.append(Paragraph(f"<b>Tip otplate:</b> {summary.get('payment_type', 'N/A')}", info_style))
        elements.append(Spacer(1, 20))
        
        # Sažetak
        elements.append(Paragraph("<b>SAŽETAK TROŠKOVA</b>", styles['Heading2']))
        elements.append(Spacer(1, 12))
        
        summary_data = [
            ['Opis', 'Iznos (KM)'],
            ['Ukupan iznos kredita', f"{summary['total_amount']:,.2f}"],
            ['Ukupno plaćena kamata', f"{summary['total_interest']:,.2f}"],
            ['Ukupni trošak', f"{summary['total_cost']:,.2f}"],
            ['Prosječna mjesečna rata', f"{summary['monthly_payment_avg']:,.2f}"]
        ]
        
        summary_table = Table(summary_data, colWidths=[3.5*inch, 2*inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 1), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#fef3c7'))
        ]))
        
        elements.append(summary_table)
        elements.append(Spacer(1, 30))
        
        # Otplatni plan
        elements.append(Paragraph("<b>OTPLATNI PLAN</b>", styles['Heading2']))
        elements.append(Spacer(1, 12))
        
        # Tabela sa otplatnim planom (prikaži prvih 12 i posljednjih 6 redova ako je dugačak)
        schedule_data = [['Mj.', 'Datum', 'Rata (KM)', 'Glavnica', 'Kamata', 'Ostatak']]
        
        display_schedule = schedule
        if len(schedule) > 24:
            display_schedule = schedule[:12] + [
                {
                    'month': '...',
                    'payment_date': '...',
                    'monthly_payment': '...',
                    'principal': '...',
                    'interest': '...',
                    'remaining_balance': '...'
                }
            ] + schedule[-6:]
        
        for item in display_schedule:
            if item['month'] == '...':
                schedule_data.append(['...', '...', '...', '...', '...', '...'])
            else:
                schedule_data.append([
                    str(item['month']),
                    item['payment_date'],
                    f"{item['monthly_payment']:,.2f}",
                    f"{item['principal']:,.2f}",
                    f"{item['interest']:,.2f}",
                    f"{item['remaining_balance']:,.2f}"
                ])
        
        schedule_table = Table(schedule_data, colWidths=[0.5*inch, 1.2*inch, 1.2*inch, 1.2*inch, 1.2*inch, 1.2*inch])
        schedule_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f3f4f6')])
        ]))
        
        elements.append(schedule_table)
        
        # Napomena ako je tabela skraćena
        if len(schedule) > 24:
            elements.append(Spacer(1, 10))
            note = Paragraph(
                f"<i>Napomena: Prikazan je skraćeni prikaz ({len(schedule)} ukupno mjeseci). "
                "Potpun plan dostupan je u online aplikaciji.</i>",
                styles['Italic']
            )
            elements.append(note)
        
        # Generiši PDF
        doc.build(elements)
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def generate_comparison_report(
        comparisons: List[Dict]
    ) -> BytesIO:
        """
        Generiše uporedni izvještaj za više kredita
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4,
                                rightMargin=30, leftMargin=30,
                                topMargin=30, bottomMargin=18)
        
        elements = []
        styles = getSampleStyleSheet()
        
        # Naslov
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1f2937'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        title = Paragraph("Uporedni Izvještaj Kredita", title_style)
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Datum
        info_style = ParagraphStyle(
            'InfoStyle',
            parent=styles['Normal'],
            fontSize=12,
            spaceAfter=6
        )
        elements.append(Paragraph(f"<b>Datum izvještaja:</b> {datetime.now().strftime('%d.%m.%Y')}", info_style))
        elements.append(Spacer(1, 20))
        
        # Uporedna tabela
        comparison_data = [['', 'Kredit 1', 'Kredit 2', 'Kredit 3'][:len(comparisons)+1]]
        
        # Dodaj redove
        rows = [
            ('Iznos kredita (KM)', 'amount'),
            ('Kamatna stopa (%)', 'annual_interest_rate'),
            ('Rok (mjeseci)', 'term_months'),
            ('Tip otplate', 'payment_type'),
            ('Ukupna kamata (KM)', 'total_interest'),
            ('Ukupni trošak (KM)', 'total_cost'),
            ('Prosječna rata (KM)', 'monthly_payment_avg')
        ]
        
        for label, key in rows:
            row = [label]
            for comp in comparisons:
                if key in ['amount', 'total_interest', 'total_cost', 'monthly_payment_avg']:
                    row.append(f"{comp['summary'].get(key, 0):,.2f}")
                elif key == 'annual_interest_rate':
                    row.append(f"{comp['input'].get(key, 0):.2f}")
                elif key == 'payment_type':
                    row.append(comp['summary'].get(key, 'N/A'))
                else:
                    row.append(str(comp['input'].get(key, 'N/A')))
            comparison_data.append(row)
        
        col_width = 1.8 * inch
        comparison_table = Table(comparison_data, colWidths=[2*inch] + [col_width] * len(comparisons))
        comparison_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
            ('BACKGROUND', (0, 1), (0, -1), colors.HexColor('#e5e7eb')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('ALIGN', (0, 1), (0, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')])
        ]))
        
        elements.append(comparison_table)
        elements.append(Spacer(1, 30))
        
        # Preporuka
        elements.append(Paragraph("<b>PREPORUKA</b>", styles['Heading2']))
        elements.append(Spacer(1, 12))
        
        # Pronađi najjeftiniji kredit
        min_cost_idx = min(range(len(comparisons)), 
                          key=lambda i: comparisons[i]['summary']['total_cost'])
        
        recommendation = Paragraph(
            f"<b>Najisplativija opcija je Kredit {min_cost_idx + 1}</b> sa ukupnim troškom "
            f"od {comparisons[min_cost_idx]['summary']['total_cost']:,.2f} KM.",
            info_style
        )
        elements.append(recommendation)
        
        # Generiši PDF
        doc.build(elements)
        buffer.seek(0)
        return buffer
