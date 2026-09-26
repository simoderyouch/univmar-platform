package com.univmar.quotation;

import com.univmar.quotation.domain.Quotation;
import com.univmar.quotation.domain.QuotationItem;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Component;

/** Produces a clean, print-ready A4 quotation using standard PDF fonts. */
@Component
public class QuotationPdfRenderer {
    private static final int PAGE_WIDTH = 595;
    // UNIVMAR landing design tokens: ink #454749, gold #c9a46e, paper #f3efe8.
    private static final String NAVY = "0.27 0.28 0.29";
    private static final String GOLD = "0.79 0.64 0.43";
    private static final String INK = "0.27 0.28 0.29";
    private static final String MUTED = "0.42 0.40 0.38";
    private static final String PALE = "0.95 0.94 0.91";

    public byte[] render(Quotation quote) {
        StringBuilder c = new StringBuilder(12_000);
        header(c, quote); customerBlock(c, quote); table(c, quote); totals(c, quote); footer(c, quote);
        return pdf(c.toString());
    }

    private void header(StringBuilder c, Quotation q) {
        fill(c, NAVY); rect(c, 0, 720, PAGE_WIDTH, 122);
        text(c, 42, 795, "UNIVMAR", 28, "F2", "1 1 1");
        text(c, 43, 772, "MARBLE & SURFACES", 8, "F2", "0.78 0.84 0.90");
        text(c, 383, 802, "QUOTATION", 16, "F2", "1 1 1");
        text(c, 383, 779, q.getNumber(), 10, "F1", "0.78 0.84 0.90");
        line(c, 383, 766, 553, 766, GOLD, 2);
        text(c, 42, 742, "Professional stone, precisely delivered.", 9, "F1", "0.78 0.84 0.90");
    }

    private void customerBlock(StringBuilder c, Quotation q) {
        fill(c, PALE); rect(c, 42, 628, 511, 67);
        text(c, 57, 676, "PREPARED FOR", 7, "F2", GOLD);
        text(c, 57, 658, safe(q.getCustomer().getName()), 13, "F2", INK);
        if (q.getCustomer().getCompanyName() != null && !q.getCustomer().getCompanyName().isBlank()) text(c, 57, 643, safe(q.getCustomer().getCompanyName()), 8, "F1", MUTED);
        if (q.getCustomer().getEmail() != null && !q.getCustomer().getEmail().isBlank()) text(c, 300, 658, safe(q.getCustomer().getEmail()), 8, "F1", MUTED);
        if (q.getCustomer().getPhone() != null && !q.getCustomer().getPhone().isBlank()) text(c, 300, 643, safe(q.getCustomer().getPhone()), 8, "F1", MUTED);
        text(c, 430, 676, "PROJECT", 7, "F2", GOLD);
        text(c, 430, 658, truncate(q.getProject().getName(), 22), 9, "F2", INK);
        text(c, 430, 643, "Valid until", 7, "F1", MUTED);
        text(c, 490, 643, date(q.getExpiryDate()), 8, "F2", INK);
    }

    private void table(StringBuilder c, Quotation q) {
        text(c, 42, 600, "QUOTATION DETAILS", 8, "F2", GOLD);
        fill(c, NAVY); rect(c, 42, 565, 511, 22);
        text(c, 54, 573, "DESCRIPTION", 7, "F2", "1 1 1"); text(c, 343, 573, "AREA", 7, "F2", "1 1 1");
        text(c, 411, 573, "UNIT PRICE", 7, "F2", "1 1 1"); text(c, 499, 573, "AMOUNT", 7, "F2", "1 1 1");
        int y = 547; int row = 0;
        for (QuotationItem item : q.getItems()) {
            if (row++ % 2 == 0) { fill(c, PALE); rect(c, 42, y - 7, 511, 28); }
            text(c, 54, y + 3, truncate(item.getMaterialName(), 30), 8, "F2", INK);
            text(c, 54, y - 8, truncate(item.getVariantLabel(), 40), 7, "F1", MUTED);
            textRight(c, 399, y, number(item.getQuantityM2(), 3) + " m2", 8, "F1", INK);
            textRight(c, 484, y, money(item.getUnitPrice()), 8, "F1", INK);
            textRight(c, 541, y, money(item.net().add(item.tax())), 8, "F2", INK);
            y -= 32;
        }
        if (q.getItems().isEmpty()) text(c, 54, y, "No line items", 8, "F1", MUTED);
        line(c, 42, y + 10, 553, y + 10, "0.82 0.84 0.86", 0.7f);
    }

    private void totals(StringBuilder c, Quotation q) {
        int top = Math.max(205, 535 - (q.getItems().size() * 32));
        fill(c, PALE); rect(c, 327, top - 103, 226, 92);
        text(c, 342, top - 30, "SUBTOTAL", 8, "F1", MUTED); textRight(c, 537, top - 30, money(q.getSubtotal()), 8, "F1", INK);
        text(c, 342, top - 49, "TAX", 8, "F1", MUTED); textRight(c, 537, top - 49, money(q.getTaxTotal()), 8, "F1", INK);
        text(c, 342, top - 68, "TRANSPORT", 8, "F1", MUTED); textRight(c, 537, top - 68, money(q.getTransport()), 8, "F1", INK);
        line(c, 342, top - 77, 537, top - 77, "0.78 0.80 0.82", 0.7f);
        text(c, 342, top - 94, "TOTAL", 10, "F2", NAVY); textRight(c, 537, top - 94, money(q.getGrandTotal()), 12, "F2", GOLD);
        int notesY = top - 18; text(c, 42, notesY, "TERMS & NOTES", 8, "F2", GOLD);
        text(c, 42, notesY - 18, "Payment terms: " + truncate(blank(q.getPaymentTerms()) ? "As agreed with sales" : q.getPaymentTerms(), 57), 8, "F1", INK);
        if (q.getNotes() != null && !q.getNotes().isBlank()) text(c, 42, notesY - 34, truncate(q.getNotes(), 67), 8, "F1", MUTED);
    }

    private void footer(StringBuilder c, Quotation q) {
        fill(c, NAVY); rect(c, 0, 0, PAGE_WIDTH, 55);
        text(c, 42, 34, "Thank you for choosing UNIVMAR.", 8, "F2", "1 1 1");
        text(c, 42, 19, "Please contact your sales representative with any questions about this quotation.", 7, "F1", "0.78 0.84 0.90");
        textRight(c, 553, 34, "QUOTE " + q.getNumber(), 7, "F2", "0.78 0.84 0.90");
        textRight(c, 553, 19, "Generated by UNIVMAR ERP", 7, "F1", "0.78 0.84 0.90");
    }

    private byte[] pdf(String content) {
        byte[] stream = content.getBytes(StandardCharsets.US_ASCII);
        List<String> objects = new ArrayList<>();
        objects.add("<< /Type /Catalog /Pages 2 0 R >>");
        objects.add("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
        objects.add("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>");
        objects.add("<< /Length " + stream.length + " >>\nstream\n" + content + "\nendstream");
        objects.add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
        objects.add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
        StringBuilder out = new StringBuilder("%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n"); List<Integer> offsets = new ArrayList<>(); offsets.add(0);
        for (int i = 0; i < objects.size(); i++) { offsets.add(out.length()); out.append(i + 1).append(" 0 obj\n").append(objects.get(i)).append("\nendobj\n"); }
        int xref = out.length(); out.append("xref\n0 ").append(objects.size() + 1).append("\n0000000000 65535 f \n");
        for (int i = 1; i < offsets.size(); i++) out.append(String.format(Locale.ROOT, "%010d 00000 n \n", offsets.get(i)));
        out.append("trailer\n<< /Size ").append(objects.size() + 1).append(" /Root 1 0 R >>\nstartxref\n").append(xref).append("\n%%EOF");
        return out.toString().getBytes(StandardCharsets.ISO_8859_1);
    }

    private void text(StringBuilder c, int x, int y, String value, int size, String font, String color) { c.append(color).append(" rg BT /").append(font).append(' ').append(size).append(" Tf 1 0 0 1 ").append(x).append(' ').append(y).append(" Tm (").append(escape(value)).append(") Tj ET\n"); }
    private void textRight(StringBuilder c, int right, int y, String value, int size, String font, String color) { text(c, right - Math.min(190, Math.max(25, value.length() * size / 2)), y, value, size, font, color); }
    private void fill(StringBuilder c, String color) { c.append(color).append(" rg\n"); }
    private void rect(StringBuilder c, int x, int y, int w, int h) { c.append(x).append(' ').append(y).append(' ').append(w).append(' ').append(h).append(" re f\n"); }
    private void line(StringBuilder c, int x1, int y1, int x2, int y2, String color, float width) { c.append(color).append(" RG ").append(width).append(" w ").append(x1).append(' ').append(y1).append(" m ").append(x2).append(' ').append(y2).append(" l S\n"); }
    private String money(BigDecimal value) { return String.format(Locale.ROOT, "%.2f MAD", value == null ? 0d : value.doubleValue()); }
    private String number(BigDecimal value, int scale) { return String.format(Locale.ROOT, "%." + scale + "f", value == null ? 0d : value.doubleValue()); }
    private String date(LocalDate value) { return value == null ? "Not specified" : value.toString(); }
    private String safe(String value) { return value == null ? "" : value; }
    private boolean blank(String value) { return value == null || value.isBlank(); }
    private String truncate(String value, int max) { String clean = safe(value); return clean.length() <= max ? clean : clean.substring(0, Math.max(0, max - 3)) + "..."; }
    private String escape(String value) { String clean = Normalizer.normalize(safe(value), Normalizer.Form.NFD).replaceAll("\\p{M}", "").replaceAll("[^\\x20-\\x7E]", " "); return clean.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)"); }
}
