package com.b2bmatch.catalogo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.b2bmatch.catalogo.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
