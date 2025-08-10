package com.example.eprocurement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tenders")
@CrossOrigin(origins = "*") // Allows all origins to access this API for development
public class TenderController {

    @Autowired
    private TenderService tenderService;

    @GetMapping
    public List<Tender> getAllTenders() {
        return tenderService.findAllTenders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tender> getTenderById(@PathVariable Long id) {
        Optional<Tender> tender = tenderService.findTenderById(id);
        return tender.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Tender createTender(@RequestBody Tender tender) {
        return tenderService.saveTender(tender);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tender> updateTender(@PathVariable Long id, @RequestBody Tender tenderDetails) {
        Optional<Tender> optionalTender = tenderService.findTenderById(id);
        if (optionalTender.isPresent()) {
            Tender tender = optionalTender.get();
            tender.setProcurementNumber(tenderDetails.getProcurementNumber());
            tender.setSubjectOfProcurement(tenderDetails.getSubjectOfProcurement());
            tender.setProcuringEntity(tenderDetails.getProcuringEntity());
            tender.setStatus(tenderDetails.getStatus());
            tender.setTenderDeadline(tenderDetails.getTenderDeadline());
            tender.setBudgetAmount(tenderDetails.getBudgetAmount());
            final Tender updatedTender = tenderService.saveTender(tender);
            return ResponseEntity.ok(updatedTender);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTender(@PathVariable Long id) {
        tenderService.deleteTenderById(id);
        return ResponseEntity.noContent().build();
    }
}