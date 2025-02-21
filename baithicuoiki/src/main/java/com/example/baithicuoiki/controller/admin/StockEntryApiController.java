package com.example.baithicuoiki.controller.admin;

import com.example.baithicuoiki.dto.StockEntryDTO;
import com.example.baithicuoiki.model.Product;
import com.example.baithicuoiki.model.StockEntry;
import com.example.baithicuoiki.model.Supplier;
import com.example.baithicuoiki.service.ProductService;
import com.example.baithicuoiki.service.StockEntryService;
import com.example.baithicuoiki.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class StockEntryApiController {
    @Autowired
    private ProductService productService;
    @Autowired
    private StockEntryService stockEntryService;
    @Autowired
    private SupplierService supplierService;

    @GetMapping("/stock_entry")
    public List<StockEntry> getAllStockEntries() {
        return stockEntryService.getAllStockEntries();
    }

    @PostMapping("/stock_entry")
    public ResponseEntity<?> addStockEntry(@RequestBody StockEntryDTO stockEntryDTO) {
        try {
            Product product = productService.getProductById(stockEntryDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + stockEntryDTO.getProductId()));

            Supplier supplier = supplierService.getSupplierById(stockEntryDTO.getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhà cung cấp với ID: " + stockEntryDTO.getSupplierId()));

            StockEntry stockEntry = new StockEntry();
            stockEntry.setProduct(product);
            stockEntry.setSupplier(supplier);
            stockEntry.setQuantity(stockEntryDTO.getQuantity());
            stockEntry.setPrice(stockEntryDTO.getPrice());

            StockEntry savedStockEntry = stockEntryService.addStockEntry(stockEntry);
            return ResponseEntity.ok(savedStockEntry);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/stock_entry/{id}")
    public ResponseEntity<?> updateStockEntry(@PathVariable Long id, @RequestBody StockEntryDTO stockEntryDTO) {
        try {
            StockEntry existingStockEntry = stockEntryService.getStockEntryById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi nhập kho với ID: " + id));

            Product product = productService.getProductById(stockEntryDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + stockEntryDTO.getProductId()));

            Supplier supplier = supplierService.getSupplierById(stockEntryDTO.getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhà cung cấp với ID: " + stockEntryDTO.getSupplierId()));

            existingStockEntry.setProduct(product);
            existingStockEntry.setSupplier(supplier);
            existingStockEntry.setQuantity(stockEntryDTO.getQuantity());
            existingStockEntry.setPrice(stockEntryDTO.getPrice());

            StockEntry updatedStockEntry = stockEntryService.updateStockEntry(existingStockEntry);
            return ResponseEntity.ok(updatedStockEntry);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/stock_entry/{id}")
    public ResponseEntity<?> deleteStockEntry(@PathVariable Long id) {
        try {
            stockEntryService.deleteStockEntryById(id);
            return ResponseEntity.ok("Xóa bản ghi nhập kho thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
