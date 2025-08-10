package com.example.eprocurement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TenderService {

    @Autowired
    private TenderRepository tenderRepository;

    public List<Tender> findAllTenders() {
        return tenderRepository.findAll();
    }

    public Optional<Tender> findTenderById(Long id) {
        return tenderRepository.findById(id);
    }

    public Tender saveTender(Tender tender) {
        return tenderRepository.save(tender);
    }

    public void deleteTenderById(Long id) {
        tenderRepository.deleteById(id);
    }
}