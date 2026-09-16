package com.univmar.rfq.api;
import com.univmar.rfq.RfqAttachmentService;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
@RestController @RequestMapping("/api/v1/quote-requests") @PreAuthorize("hasRole('CUSTOMER')")
public class RfqAttachmentController { private final RfqAttachmentService service; public RfqAttachmentController(RfqAttachmentService service){this.service=service;} @GetMapping("/{id}/attachments") public List<RfqAttachmentDtos.Response> list(@PathVariable Long id,Authentication a){return service.mine(id,(Long)a.getPrincipal());}@PostMapping(value="/{id}/attachments",consumes=MediaType.MULTIPART_FORM_DATA_VALUE) public RfqAttachmentDtos.Response upload(@PathVariable Long id,@RequestPart("file") MultipartFile file,Authentication a){return service.upload(id,(Long)a.getPrincipal(),file);}@GetMapping("/attachments/{attachmentId}/download") public ResponseEntity<Resource> download(@PathVariable Long attachmentId,Authentication a){var d=service.mineDownload(attachmentId,(Long)a.getPrincipal());return ResponseEntity.ok().contentType(MediaType.parseMediaType(d.contentType())).header("Content-Disposition",ContentDisposition.attachment().filename(d.filename()).build().toString()).body(d.resource());}}
